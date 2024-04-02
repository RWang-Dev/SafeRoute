import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 44.9765,
  lng: -93.23,
};

const defaultZoom = 10; // Default zoom level

const bounds = {
  north: 44.99,
  south: 44.965,
  east: -93.21, // Adjusted for example
  west: -93.25, // Adjusted for example
};

const CrimeMap = ({ data }) => {
  const [selectedCrime, setSelectedCrime] = useState(null);
  const mapRef = useRef(null);

  // Attach the event listener after the map has loaded
  useEffect(() => {
    if (mapRef.current) {
      const listener = mapRef.current.addListener("zoom_changed", () => {
        const currentZoom = mapRef.current.getZoom();
        if (currentZoom < defaultZoom) {
          mapRef.current.setZoom(defaultZoom);
        }
      });

      return () => {
        if (listener) {
          listener.remove();
        }
      };
    }
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={defaultZoom}
        options={{
          restriction: {
            latLngBounds: bounds,
            strictBounds: true,
          },
          minZoom: defaultZoom, // This ensures users cannot zoom out further than defaultZoom
        }}
        onLoad={(mapInstance) => (mapRef.current = mapInstance)}
      >
        {data.map((crime) => (
          <Marker
            key={`${crime.Latitude}-${crime.Longitude}`}
            position={{ lat: crime.Latitude, lng: crime.Longitude }}
            onClick={() => setSelectedCrime(crime)}
          />
        ))}

        {selectedCrime && (
          <InfoWindow
            position={{
              lat: selectedCrime.Latitude,
              lng: selectedCrime.Longitude,
            }}
            onCloseClick={() => setSelectedCrime(null)}
          >
            <div>
              {/* <h2>Incident Location: {selectedCrime["Incident Location"]}</h2> */}
              <h2>Severity Score: {selectedCrime["Total Severity Score"]}</h2>
              <h2>Crime Count: {selectedCrime["Crime Count"]}</h2>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

function areEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
}

export default React.memo(CrimeMap, areEqual);
