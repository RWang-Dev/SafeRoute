/* global google */
import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";

import nightMode from "../map-styles/NightMode";
import classes from "./CrimeMap.module.css";

{
  /* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link> */
}

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
  north: 44.989,
  south: 44.965,
  east: -93.21, //bounds for campus
  west: -93.25,
};

const CrimeMap = ({ data }) => {
  /*These are called states; they are used to determine 
  things like whether or not night mode is on or off*/
  const [selectedCrime, setSelectedCrime] = useState(null);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const mapRef = useRef(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState("Guest");
  const [userID, setuserID] = useState("Guest");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const response = await fetch("/.auth/me");
    const data = await response.json();
    if (data.clientPrincipal != null) {
      setuserID(data.clientPrincipal.userId);
      setUsername(data.clientPrincipal.userDetails);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Error getting current location: ", error);
      }
    );
  }, []);

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

  const toggleNightMode = () => setIsNightMode(!isNightMode);

  return (
    <>
      <div
        className={
          sidebarOpen ? classes.mapContainer : classes.mapContainerClosed
        }
      >
        <button className={classes.hamburgerButton} onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className={sidebarOpen ? classes.sideBar : classes.sideBarClosed}>
          <div className={classes.profile}>
            <img src="Kluver_Daniel_1.jpg"></img>
            <h2>{username}</h2>
          </div>
          <Link to="/locations" className={classes.savedLocations}>
            {" "}
            Saved Locations{" "}
          </Link>
          <button
            className={classes.toggleButton}
            onClick={toggleNightMode}
            style={{
              top: "10px",
              left: "10px",
              zIndex: 1000,
            }}
          >
            Toggle Night Mode
          </button>
        </div>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentUserLocation || center}
            zoom={defaultZoom}
            options={{
              restriction: {
                latLngBounds: bounds,
                strictBounds: true,
              },
              minZoom: defaultZoom, // This ensures users cannot zoom out further than defaultZoom
              styles: isNightMode ? nightMode : [],
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
                  <h2>
                    Severity Score: {selectedCrime["Total Severity Score"]}
                  </h2>
                  <h2>Crime Count: {selectedCrime["Crime Count"]}</h2>
                </div>
              </InfoWindow>
            )}

            {currentUserLocation && (
              <Marker
                position={currentUserLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "green",
                  fillOpacity: 1,
                  scale: 6,
                  strokeColor: "blue",
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </>
  );
};

function areEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
}

export default React.memo(CrimeMap, areEqual);
