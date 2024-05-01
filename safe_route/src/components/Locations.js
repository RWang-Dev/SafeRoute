import React from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import classes from "./Locations.module.css";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

function Locations() {
    const [locations, setLocations] = useState([]);
    const [username, setUsername] = useState("Guest");
    const [userID, setuserID] = useState("Guest");
    const autocompleteRef = useRef(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const handleOnLoad = (autoc) => {
        autocompleteRef.current = autoc;
    };
    const fetchUser = async () => {
        const response = await fetch("/.auth/me");
        const data = await response.json();
        if (data.clientPrincipal !== null) {
            setuserID(data.clientPrincipal.userId);
            setUsername(data.clientPrincipal.userDetails);
        }
    };

    useEffect(() => {
        if (userID !== "Guest") {
            fetchLocations();
        }
    }, [userID]);

    async function fetchLocations() {
        let response = await fetch("/api/getLocations/?userID=" + userID);

        const data = await response.json();
        setLocations(data);
    }

    async function addLocation() {
        const location_name = document.getElementById("location-name").value;
        const location_address = document.getElementById("location-address").value;
        const place_id = autocompleteRef.current.getPlace().place_id;

        const response = await fetch("/api/addLocation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userID: userID,
                location_name: location_name,
                location_address: location_address,
                place_id: place_id,
            }),
        });

        if (response.ok) {
            //clear input fields after Save Location is pressed
            document.getElementById("location-name").value = "";
            document.getElementById("location-address").value = "";
            fetchLocations();
        } else {
            console.log("ERROR adding location");
        }
    }

    async function deleteLocation(loc_id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this location?");
        if (confirmDelete) {
            const response = await fetch("/api/deleteLocation/?loc_id=" + loc_id, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchLocations();
            } else {
                console.log("ERROR deleting location");
            }
        }
    }
    return (
        <div className={classes.outerContainer}>
            <div className={classes.navigationBar}>
                <Link className={classes.navWidget} to="/">
                    Home Page
                </Link>
                <Link className={classes.navWidget} to="/map">
                    Map Page
                </Link>
                <a href="/.auth/logout" className={classes.navWidget}>
                    Logout
                </a>
            </div>
            <div className={classes.mainContainer}>
                <div className={classes.savedLocations}>
                    <h2>Saved Locations</h2>
                    {locations.length > 0 ? (
                        <ol> 
                            {locations.map((loc, index) => (
                                <li key={index}> 
                                    <div loc_id={loc._id} className={classes.locationItem}>
                                        <div className={classes.locationName}>{loc.location_name}</div>
                                        <div className={classes.icons}>
                                            <Link to={"/locations/" + loc._id}>
                                                <FaEdit className={classes.editIcon} />
                                            </Link>
                                            <FaTrash onClick={() => deleteLocation(loc._id)} className={classes.deleteIcon} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol> 
                    ) : (
                        <span>No Locations Saved</span>
                    )}
                </div>
                <div className={classes.createLocation}>
                    <h2>Create New Location</h2>

                    <LoadScript
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} /// Set mapLoaded to true when the API script has loaded
                        libraries={["places"]}
                    >
                        <Autocomplete onLoad={handleOnLoad}>
                            <input id="location-address" type="text" placeholder="Type in address" />
                        </Autocomplete>
                    </LoadScript>

                    <br />
                    <input id="location-name" type="text" placeholder="Add Custom Name" />
                    <br />
                    <br />
                    <button className={classes.saveLocationBtn} onClick={() => addLocation()}>
                        Save Location
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Locations;
