import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../assets/styles/eventForm.scss";
import { eventCategories } from "../utils/eventCategories";
import { createEvent, editEventAction } from "../features/events/eventActions";
import { uploadImage } from "../features/upload/uploadActions";
import LocationPicker from "./LocationPicker";
import LocationSelector from "./LocationSelector";

const EventForm = ({ event, closeModal }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [locations, setLocations] = useState([]);
  const [createdEventId, setCreatedEventId] = useState(event?._id || null);
  const [isImageStep, setIsImageStep] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [coordinates, setCoordinates] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchAddress = async (value) => {
    if (!value) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
    );

    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      setCoordinates({ lat, lng });

      formik.setFieldValue("location", data[0].display_name);
    }
  };
  // ==========================
  // Locations
  // ==========================
  useEffect(() => {
    const fetchedLocations = [
      { id: "1", name: "New York, Main Street 123" },
      { id: "2", name: "Los Angeles, Sunset Boulevard 45" },
      { id: "3", name: "San Francisco, Market Street 78" },
    ];
    setLocations(fetchedLocations);
  }, []);

  // ==========================
  // Select images (preview only)
  // ==========================
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    formik.setFieldValue("images", [...formik.values.images, ...previewUrls]);
  };

  // ==========================
  // Formik
  // ==========================
  const steps = [
    { id: 1, label: "Information", title: "Basic Information", fields: ["name", "description", "category"] },
    { id: 2, label: "Participants", title: "Who's Attending?", fields: ["targetAudience", "participants"] },
    { id: 3, label: "Date & Price", title: "When & How Much?", fields: ["date", "price"] },
    { id: 4, label: "Location", title: "Where Will It Be?", fields: ["location"] },
    { id: 5, label: "Keywords", title: "Tags", fields: ["keywords"] },
  ];

  const formik = useFormik({
    initialValues: {
      name: event?.name || "",
      description: event?.description || "",
      category: event?.category || "",
      targetAudience: event?.targetAudience || "",
      participants: event?.participants || 2,
      date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      price: event?.price || "",
      keywords: event?.keywords || [],
      images: [],

      location: {
        venueName: "",
        street: "",
        buildingNumber: "",
        city: "",
        floor: "",
        room: "",
        lat: null,
        lng: null
      }
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Event name is required"),
      category: Yup.string().required("Category is required"),
      date: Yup.date().required("Event date is required"),
      price: Yup.number().min(0).required("Price is required"),
      participants: Yup.number().min(2).required("Participants is required"),
    }),
    onSubmit: async (values) => {
      if (event) {
        await dispatch(editEventAction({ id: event._id, updatedData: values }));
        closeModal();
        return;
      }

      const res = await dispatch(createEvent(values));

      if (res.meta.requestStatus === "fulfilled") {
        setCreatedEventId(res.payload._id);
        setIsImageStep(true);
      }
    },
  });

  const currentStepConfig = steps.find((s) => s.id === currentStep);

  // ==========================
  // Upload all images and update event
  // ==========================
  const handleFinish = async () => {
    if (!createdEventId) return;

    const uploadedUrls = [];

    for (const file of selectedFiles) {
      const res = await dispatch(
        uploadImage({
          file,
          target: "event",
          id: createdEventId,
        })
      );

      if (res.meta.requestStatus !== "fulfilled") {
        alert("Image upload failed");
        return;
      }

      uploadedUrls.push(res.payload.imageUrl);
    }

    // עדכון האירוע עם התמונות שהועלו
    await dispatch(
      editEventAction({
        id: createdEventId,
        updatedData: { images: uploadedUrls },
      })
    );

    navigate("/events");
    closeModal();
  };

  // ==========================
  // IMAGE STEP
  // ==========================
  if (isImageStep) {
    return (
      <div className="event-form">
        <h2>Upload Event Images</h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />

        <div className="image-preview-container">
          {formik.values.images.map((url, index) => (
            <div key={index} className="image-preview">
              <img src={url} alt="event" />
              <button
                type="button"
                onClick={() => {
                  const updatedPreviews = formik.values.images.filter((_, i) => i !== index);
                  const updatedFiles = selectedFiles.filter((_, i) => i !== index);

                  setSelectedFiles(updatedFiles);
                  formik.setFieldValue("images", updatedPreviews);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button style={{ marginTop: "20px" }} onClick={handleFinish}>
          Finish
        </button>
      </div>
    );
  }

  // ==========================
  // FORM STEP
  // ==========================
  return (
    <form className="event-form" onSubmit={formik.handleSubmit}>
      <div className="stepper">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`step ${currentStep === step.id ? "active" : ""} ${currentStep > step.id ? "completed" : ""}`}
            onClick={() => setCurrentStep(step.id)}
          >
            <span className="label">{step.label}</span>
          </div>
        ))}
      </div>

      <div className="form-content">
        {steps.map(
          (step) =>
            currentStep === step.id && (
              <div key={step.id} className="form-step active">
                <div className="step-heading">{step.title}</div>

                {step.fields.map((field) => (
                  <div key={field} className="form-group">

                    <label>{field}</label>

                    {field === "location" ? (

                      <div className="form-group">

                        <label>Search location</label>
                        <input
                          placeholder="Search address"
                          onChange={(e) => searchAddress(e.target.value)}
                        />

                        <label>Venue name</label>
                        <input
                          name="location.venueName"
                          value={formik.values.location.venueName}
                          onChange={formik.handleChange}
                        />

                        <label>Street</label>
                        <input
                          name="location.street"
                          value={formik.values.location.street}
                          onChange={formik.handleChange}
                        />

                        <label>Building number</label>
                        <input
                          name="location.buildingNumber"
                          value={formik.values.location.buildingNumber}
                          onChange={formik.handleChange}
                        />

                        <label>City</label>
                        <input
                          name="location.city"
                          value={formik.values.location.city}
                          onChange={formik.handleChange}
                        />

                        <label>Floor (optional)</label>
                        <input
                          name="location.floor"
                          value={formik.values.location.floor}
                          onChange={formik.handleChange}
                        />

                        <label>Room / Hall</label>
                        <input
                          name="location.room"
                          value={formik.values.location.room}
                          onChange={formik.handleChange}
                        />

                        <LocationSelector
                          location={formik.values.location}
                          setLocation={(loc) => formik.setFieldValue("location", loc)}
                        />

                      </div>

                    ) : (

                      <input
                        name={field}
                        type={
                          field === "participants" || field === "price"
                            ? "number"
                            : field === "date"
                              ? "datetime-local"
                              : "text"
                        }
                        value={formik.values[field]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                    )}

                    {formik.touched[field] && formik.errors[field] && (
                      <div className="error">{formik.errors[field]}</div>
                    )}


                  </div>

                ))}
              </div>
            )
        )}

        <div className="form-footer">
          {currentStep > 1 && (
            <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </button>
          )}

          {currentStep < steps.length && (
            <button
              type="button"
              disabled={!currentStepConfig.fields.every((f) => !formik.errors[f])}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </button>
          )}

          {currentStep === steps.length && (
            <button type="submit">
              {event ? "Update Event" : "Create Event"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default EventForm;
