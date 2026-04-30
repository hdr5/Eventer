import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../assets/styles/eventForm.scss";
import { createEvent, editEventAction } from "../features/events/eventActions";
import { uploadImage } from "../features/upload/uploadActions";
import LocationPicker from "./LocationPicker";
import { parseAddress } from "../utils/addressUtils";

const EventForm = ({ event, closeModal }) => {
  
  const [currentStep, setCurrentStep] = useState(1);
  const [createdEventId, setCreatedEventId] = useState(event?._id || null);
  const [isImageStep, setIsImageStep] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        lat: null,
        lng: null,
        address: "",
        extraInfo: "",
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
      const loc = values.location;

      if (loc?.lat == null || loc?.lng == null) {
        alert("Please select a location on the map");
        return;
      }

      const { street, houseNumber, city } = parseAddress(loc.address);

      const payload = {
        ...values,

        location: {
          geo: {
            type: "Point",
            coordinates: [loc.lng, loc.lat],
          },
          address: {
            street,
            houseNumber,
            city,
            fullAddress: loc.address,
          },
          details: {
            notes: loc.extraInfo || "",
          },
        },
      };

      const res = await dispatch(createEvent(payload));

      if (res.meta.requestStatus === "fulfilled") {
        setCreatedEventId(res.payload._id);
        setIsImageStep(true);
      }
    }
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

                        <LocationPicker
                          value={formik.values.location}
                          onChange={(loc) => formik.setFieldValue("location", loc)}
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
