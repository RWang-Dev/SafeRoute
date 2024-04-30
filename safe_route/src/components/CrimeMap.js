/* global google */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow, LoadScript, Autocomplete } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import nightMode from "../map-styles/NightMode";
import classes from "./CrimeMap.module.css";
import personIcon from "../images/person.png";

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
    const [showLocations, setShowLocations] = useState(false);
    const [username, setUsername] = useState("Guest");
    const [userID, setuserID] = useState("Guest");
    const [mapLoaded, setMapLoaded] = useState(false); /// Add state to track map loaded status
    const [favorites, setFavorites] = useState([]);
    const [locations, setLocations] = useState([]);
    const [savedLocations, setSavedLocations] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [severityRange, setSeverityRange] = useState({ min: 0, max: 100 });

    const autocompleteRef = useRef(null);

    // This function is called when the Autocomplete component has loaded
    const handleOnLoad = (autoc) => {
        autocompleteRef.current = autoc;
    };

    // This function is called when the user selects a place from the Autocomplete dropdown
    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                // setCurrentUserLocation({
                //   lat: place.geometry.location.lat(),
                //   lng: place.geometry.location.lng(),
                // });
                addFavorite(place); // Assuming addFavorite is a function that adds the place to a list of favorites
            } else {
                console.log("No geometry found for the place, try a different input.");
            }
        }
    };

    const handleSavedLocations = async (location_address, place_id) => {
        const location_data = await getCoordinatesFromPlaceId(place_id);
        if (location_data) {
            addSavedLocations(location_address, place_id, location_data); // Assuming addFavorite is a function that adds the place to a list of favorites
        } else {
            console.log("No geometry found for the place, try a different input.");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (userID != "Guest") {
            getSavedLocations();
        }
    }, [userID]);

    useEffect(() => {
        locations.forEach((location) => {
            handleSavedLocations(location.location_address, location.place_id);
        });
    }, [locations]);

    const fetchUser = async () => {
        const response = await fetch("/.auth/me");
        const data = await response.json();
        if (data.clientPrincipal != null) {
            setuserID(data.clientPrincipal.userId);
            setUsername(data.clientPrincipal.userDetails);
        }
    };

    async function getCoordinatesFromPlaceId(placeId) {
        const service = new google.maps.places.PlacesService(document.createElement("div"));

        try {
            const response = await new Promise((resolve, reject) => {
                service.getDetails({ placeId: placeId }, (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(place);
                    } else {
                        reject("PlacesService failed due to: " + status);
                    }
                });
            });

            if (response.geometry) {
                const lat = response.geometry.location.lat();
                const lng = response.geometry.location.lng();
                return { lat, lng }; // Return an object with latitude and longitude
            } else {
                console.log("No geometry found for the place.");
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    const getMarkerColor = (severityScore) => {
        if (severityScore < 50) {
            return "yellow";
        } else if (severityScore >= 50 && severityScore <= 75) {
            return "orange";
        } else {
            return "red";
        }
    };

    const addFavorite = (place) => {
        if (place.geometry && place.geometry.location) {
            const newFavorite = {
                id: place.place_id, // unique identifier for the place
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setFavorites((prevFavorites) => [...prevFavorites, newFavorite]);
        } else {
            alert("Selected place does not have a location.");
        }
    };

    const addSavedLocations = (location_address, place_id, location_data) => {
        if (location_data) {
            const newSaved = {
                id: place_id,
                name: location_address,
                lat: location_data.lat,
                lng: location_data.lng,
            };
            setSavedLocations((prevSaved) => [...prevSaved, newSaved]);
        } else {
            alert("Selected place does not have a location.");
        }
    };

    async function getSavedLocations() {
        const response = await fetch("/api/getLocations/?userID=" + userID);
        const data = await response.json();

        setLocations(data);
        console.log(data);
    }
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
    const toggleLocations = () => setShowLocations(!showLocations);
    const buttonClass = isNightMode ? "toggleButtonNight" : "toggleButtonDay";
    const buttonText = isNightMode ? "Turn Night Mode Off" : "Turn Night Mode On";

    const locationClass = showLocations == false ? "showLocations" : "hideLocations";
    const locationText = showLocations == false ? "Show Saved Locations" : "Hide Saved Locations";

    const libraries = ["places"];

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

	const handleSeverityChange = (min, max) => {
		setSeverityRange({ min, max });
	  };
	  

    return (
        <>
            <div className={classes.container}>
                {!isSidebarOpen && (
                    <button className={classes.hamburger} onClick={toggleSidebar}>
                        <span className={classes.bar}></span>
                        <span className={classes.bar}></span>
                        <span className={classes.bar}></span>
                    </button>
                )}
                <div className={`${classes.sideBar} ${!isSidebarOpen ? classes.sideBarClosed : ""}`}>
                    <div className={classes.navigationBar}>
                        <Link className={classes.navWidget} to="/">
                            Home
                        </Link>
                        <a className={classes.navWidget} href="/.auth/logout">
                            Logout
                        </a>
                        {isSidebarOpen && (
                            <button className={classes.closeWidget} onClick={toggleSidebar}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                        )}
                    </div>
                    <div className={classes.profile}>
                        <img src="user_icon.png" alt="user icon"></img>
                        <h2>{username}</h2>
                    </div>
                    <div>
                        <LoadScript
                            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                            libraries={libraries}
                            onLoad={() => setMapLoaded(true)} /// Set mapLoaded to true when the API script has loaded
                        >
                            <Autocomplete onLoad={handleOnLoad} onPlaceChanged={handlePlaceChanged} className={classes.searchInputContainer}>
                                <input type="text" placeholder="Search for a place" />
                            </Autocomplete>
                        </LoadScript>
                    </div>
                    {userID !== "Guest" ? (
                        <Link to="/locations" className={classes.savedLocations}>
                            {" "}
                            My Saved Locations{" "}
                        </Link>
                    ) : (
                        <a href="/.auth/login/github" className={classes.savedLocations}>
                            {" "}
                            Login to Save Locations
                        </a>
                    )}
                    <div className={classes.severityFilter}>
                        <h3>Filter by Severity Score:</h3>
                        <div>
                            <label>Min Severity: {severityRange.min}</label>
                            <input type="range" min={0} max={100} value={severityRange.min} onChange={(e) => handleSeverityChange(parseInt(e.target.value), severityRange.max)} />
                        </div>
                        <div>
                            <label>Max Severity: {severityRange.max}</label>
                            <input type="range" min={0} max={100} value={severityRange.max} onChange={(e) => handleSeverityChange(severityRange.min, parseInt(e.target.value))} />
                        </div>
                    </div>

                    <div className={classes.toggleButtons}>
                        <button className={`${classes[locationClass]}`} onClick={toggleLocations} title="Represented by red location pins">
                            {locationText}
                        </button>
                        <button
                            className={`${classes[buttonClass]}`}
                            onClick={toggleNightMode}
                            style={{
                                top: "10px",
                                left: "10px",
                                zIndex: 1000,
                            }}
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
                <div className={`${classes.map}`}>
                    <LoadScript
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                        libraries={libraries}
                        onLoad={() => setMapLoaded(true)} /// Set mapLoaded to true when the API script has loaded
                    >
                        {mapLoaded && ( /// Only render the GoogleMap component if the API script has loaded
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={currentUserLocation || center}
                                zoom={defaultZoom}
                                options={{
                                    restriction: {
                                        latLngBounds: bounds,
                                        strictBounds: true,
                                    },
                                    minZoom: defaultZoom,
                                    styles: isNightMode ? nightMode : [],
                                    mapTypeControlOptions: {
                                        position: google.maps.ControlPosition.TOP_CENTER,
                                    },
                                }}
                                onLoad={(mapInstance) => (mapRef.current = mapInstance)}
                            >
                                {data.map((crime) => {
                                    if (crime["Total Severity Score"] >= severityRange.min && crime["Total Severity Score"] <= severityRange.max) {
                                        return (
                                            <Marker
                                                key={`${crime.Latitude}-${crime.Longitude}`}
                                                position={{ lat: crime.Latitude, lng: crime.Longitude }}
                                                onClick={() => setSelectedCrime(crime)}
                                                icon={{
                                                    path: google.maps.SymbolPath.CIRCLE,
                                                    fillColor: getMarkerColor(crime["Total Severity Score"]),
                                                    fillOpacity: 0.55,
                                                    scale: 20,
                                                    strokeColor: "black",
                                                    strokeWeight: 1,
                                                }}
                                            />
                                        );
                                    } else {
                                        return null;
                                    }
                                })}

                                {favorites.map(
                                    (
                                        favorite /// Render markers for favorite places
                                    ) => (
                                        <Marker
                                            key={favorite.id}
                                            position={{ lat: favorite.lat, lng: favorite.lng }}
                                            onClick={() =>
                                                setSelectedCrime({
                                                    Latitude: favorite.lat,
                                                    Longitude: favorite.lng,
                                                    "Total Severity Score": "N/A",
                                                    "Crime Count": "N/A",
                                                })
                                            }
                                        />
                                    )
                                )}
                                {showLocations == true
                                    ? savedLocations.map(
                                          (
                                              location /// Render markers for favorite places
                                          ) => (
                                              <Marker
                                                  key={location.id}
                                                  position={{ lat: location.lat, lng: location.lng }}
                                                  onClick={() =>
                                                      setSelectedCrime({
                                                          Latitude: location.lat,
                                                          Longitude: location.lng,
                                                          "Total Severity Score": "N/A",
                                                          "Crime Count": "N/A",
                                                      })
                                                  }
                                                  title={location.name}
                                              />
                                          )
                                      )
                                    : null}

                                {selectedCrime && (
                                    <InfoWindow
                                        position={{
                                            lat: selectedCrime.Latitude,
                                            lng: selectedCrime.Longitude,
                                        }}
                                        onCloseClick={() => setSelectedCrime(null)}
                                    >
                                        <div>
                                            <h2>Severity Score: {selectedCrime["Total Severity Score"]}</h2>
                                            <h2>Crime Count: {selectedCrime["Crime Count"]}</h2>
                                        </div>
                                    </InfoWindow>
                                )}

                                {currentUserLocation && (
                                    <Marker
                                        position={currentUserLocation}
                                        icon={{
                                            url: personIcon,
                                            scaledSize: new google.maps.Size(17, 35),
                                            // path: google.maps.SymbolPath.CIRCLE,
                                            // fillColor: "green",
                                            // fillOpacity: 1,
                                            // scale: 6,
                                            // strokeColor: "blue",
                                            // strokeWeight: 2,
                                        }}
                                    />
                                )}
                            </GoogleMap>
                        )}
                    </LoadScript>
                </div>
            </div>
        </>
    );
};

function areEqual(prevProps, nextProps) {
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
}

export default React.memo(CrimeMap, areEqual);
