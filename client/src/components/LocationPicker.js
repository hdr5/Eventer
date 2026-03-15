// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import { useState } from "react";

// function LocationMarker({ setCoordinates }) {
//   const [position, setPosition] = useState(null);

//   useMapEvents({
//     click(e) {
//       setPosition(e.latlng);
//       setCoordinates(e.latlng);
//     }
//   });

//   return position === null ? null : <Marker position={position} />;
// }

// const LocationPicker = ({ setCoordinates }) => {
//   return (
//     <MapContainer
//       center={[31.7683, 35.2137]}
//       zoom={13}
//       style={{ height: "300px", width: "100%" }}
//     >
//       <TileLayer
//         attribution="© OpenStreetMap"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       <LocationMarker setCoordinates={setCoordinates} />
//     </MapContainer>
//   );
// };

// export default LocationPicker;

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";

function MapUpdater({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView([coordinates.lat, coordinates.lng], 15);
    }
  }, [coordinates]);

  return null;
}

function LocationMarker({ setCoordinates }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCoordinates(e.latlng);
    }
  });

  return position ? <Marker position={position} /> : null;
}

const LocationPicker = ({ coordinates, setCoordinates }) => {
  return (
    <MapContainer
      center={[31.7683, 35.2137]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater coordinates={coordinates} />

      <LocationMarker setCoordinates={setCoordinates} />

      {coordinates && <Marker position={[coordinates.lat, coordinates.lng]} />}
    </MapContainer>
  );
};

export default LocationPicker;