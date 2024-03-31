import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CrimeMap = ({ data }) => {
  // Optional: Define a default center for the map
  const defaultPosition = [44.9733, -93.2277]; // You can change this to a more relevant location

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((crime, index) => (
        <Marker key={index} position={[crime.Latitude, crime.Longitude]}>
          <Popup>
            {crime["Incident Location"]}
            <br />
            Severity Score: {crime["Total Severity Score"]}
            <br />
            Crime Count: {crime["Crime Count"]}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CrimeMap;
