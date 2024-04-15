import React from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import classes from "./Locations.module.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Locations() {
  const [locations, setLocations] = useState([]);
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

  useEffect(() => {
    if (userID != "Guest") {
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

    const response = await fetch("/api/addLocation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: userID,
        location_name: location_name,
        location_address: location_address,
      }),
    });

    if (response.ok) {
      fetchLocations();
    } else {
      console.log("ERROR adding location");
    }
  }

  async function deleteLocation(loc_id) {
    const response = await fetch("/api/deleteLocation/?loc_id=" + loc_id, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchLocations();
    } else {
      console.log("ERROR deleting location");
    }
  }
  return (
    <div className={classes.outerContainer}>
      <div className={classes.mainContainer}>
        <div className={classes.savedLocations}>
          <h2>Saved Locations</h2>
          {locations.length > 0 ? (
            locations.map((loc, index) => (
              <div
                loc_id={loc._id}
                key={index}
                className={classes.locationItem}
              >
                <div className={classes.locationName}>{loc.location_name}</div>
                <div className={classes.icons}>
                  <Link to={"/locations/" + loc._id}>
                    <FaEdit className={classes.editIcon} />
                  </Link>
                  <FaTrash
                    onClick={() => deleteLocation(loc._id)}
                    className={classes.deleteIcon}
                  />
                </div>
              </div>
            ))
          ) : (
            <span>No Locations Saved</span>
          )}
        </div>
        <div className={classes.createLocation}>
          <h2>Create New Location</h2>
          <input
            id="location-address"
            type="text"
            placeholder="Type in address"
          />
          <br />
          <br />
          <input id="location-name" type="text" placeholder="Add Custom Name" />
          <br />
          <br />
          <button onClick={() => addLocation()}>Save Location</button>
          <div>
            <Link to="/">
              <button className={classes.backButtons}>Home</button>
            </Link>
            <Link to="/map">
              <button className={classes.backButtons}>Map</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Locations;
