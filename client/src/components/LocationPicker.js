import { useState, useRef, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "../hooks/useGoogleMaps";
import { searchAddress, reverseGeocode } from "../features/location/locationActions";
import { useDispatch, useSelector } from "react-redux";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = { lat: 32.0853, lng: 34.7818 };

// ===== FORMAT ADDRESS (STRING ONLY!) =====
const formatShortAddress = (item) => {
  const a = item.address || {};

  const street =
    a.road ||
    a.pedestrian ||
    a.footway ||
    "";

  const number = a.house_number || "";

  const city =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    "";

  const streetPart = [street, number].filter(Boolean).join(" ");

  if (!streetPart && !city) return item.display_name || "";

  return [streetPart, city].filter(Boolean).join(", ");
};

const LocationPicker = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const { results = [], status } = useSelector((s) => s.location || {});

  const { isLoaded } = useGoogleMaps();
  const mapRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  // ===== UPDATE SUGGESTIONS =====
  useEffect(() => {
    if (!Array.isArray(results)) return;

    const formatted = results
      .map((item) => ({
        ...item,
        shortAddress: formatShortAddress(item),
      }))
      .filter((x) => x.shortAddress);

    setSuggestions(formatted);

  }, [results]);

  // useEffect(() => {
  // //unmounted
  //   return () => {
  //     setSuggestions([]);
  //   };
  // }, []);

  // useEffect(() => {
  //   console.log("mounted");

  //   return () => {
  //     console.log("unmounted");
  //   };
  // }, []);

  if (!isLoaded) return <div>Loading map...</div>;

  // ===== SEARCH =====
  const handleSearch = (text) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text || text.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      dispatch(searchAddress(text));
    }, 350);
  };

  // ===== SELECT =====
  const selectLocation = (item) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    onChange({
      lat,
      lng,
      address: item.shortAddress, // תמיד string
      extraInfo: value?.extraInfo || ""
    });

    setSuggestions([]);

    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(16);
  };

  // ===== MAP CLICK =====
  const handleMapClick = async (e) => {
    setSuggestions([]);

    dispatch({ type: "location/clearResults" }); // 👈 חשוב

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const res = await dispatch(reverseGeocode({ lat, lon: lng }));
    const data = res.payload;

    const address = formatShortAddress(data);

    onChange({
      lat,
      lng,
      address,
      extraInfo: value?.extraInfo || "",
      geo: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });
  };

  return (
    <div className="location-picker">
      <div className="location-search-wrapper">
        {/* INPUT */}
        <input
          type="text"
          className="location-search-input"
          placeholder="Search location..."
          value={value?.address || ""}
          onChange={(e) => {
            const text = e.target.value;

            onChange({
              ...(value || {}),
              address: text,
            });

            handleSearch(text);
          }}
        />

        {/* LOADING */}
        {status === "loading" && <div>Loading...</div>}

        {/* RESULTS */}
        {suggestions.length > 0 && (
          <div className="location-results">
            {suggestions.map((item) => (
              <div
                key={item.place_id || item.osm_id}
                className="location-item"
                onClick={() => selectLocation(item)}
              >
                {item.shortAddress}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* EXTRA INFO */}
      <input
        type="text"
        className="location-extra-input"
        placeholder="Floor / entrance / building..."
        value={value?.extraInfo || ""}
        onChange={(e) =>
          onChange({
            ...(value || {}),
            extraInfo: e.target.value,
          })
        }
      />

      {/* MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          value?.lat && value?.lng
            ? { lat: value.lat, lng: value.lng }
            : defaultCenter
        }
        zoom={12}
        onLoad={(map) => (mapRef.current = map)}
        onClick={handleMapClick}
      >
        {value?.lat && value?.lng && (
          <Marker position={{ lat: value.lat, lng: value.lng }} />
        )}
      </GoogleMap>
    </div>
  );
};

export default LocationPicker;