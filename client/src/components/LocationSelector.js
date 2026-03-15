import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function MarkerSelector({ setLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {

      const { lat, lng } = e.latlng;

      setPosition(e.latlng);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      setLocation({
        address: data.display_name,
        city: data.address?.city || "",
        lat,
        lng
      });
    }
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationSelector({ location, setLocation }) {

  const searchAddress = async (value) => {

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
    );

    const data = await res.json();

    if (!data.length) return;

    const place = data[0];

    setLocation({
      address: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon)
    });
  };

  return (
    <div>

      <input
        placeholder="Search address"
        value={location.address}
        onChange={(e)=>searchAddress(e.target.value)}
      />

      <input
        placeholder="Venue name (optional)"
        value={location.venueName}
        onChange={(e)=>setLocation({
          ...location,
          venueName:e.target.value
        })}
      />

      <MapContainer
        center={[31.7683,35.2137]}
        zoom={13}
        style={{height:"300px"}}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerSelector setLocation={setLocation}/>

        {location.lat && (
          <Marker position={[location.lat,location.lng]} />
        )}

      </MapContainer>

    </div>
  );
}