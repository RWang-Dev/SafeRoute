import React from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import classes from "./LocationEdit.module.css";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import SubButton from "../routes/SubButton";

function LocationEdit() {
  const { loc_id } = useParams();
  const [locations, setLocations] = useState([]);
  const [username, setUsername] = useState("Guest");
  const [userID, setuserID] = useState("Guest");
  const [loc_name, setLocName] = useState("Loading...");
  const [loc_addr, setAddr] = useState("Loading...");
  const autocompleteRef = useRef(null);
  let navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  useEffect(() => {
    fetchUser();
  
    // Need a delay to ensure that userID is set before the if statement begins
    const timer = setTimeout(() => {
      if (userID !== "Guest") {
        fetchLocation();
      } else {
        navigate("/404");
      }
    }, 500);
  
    return () => clearTimeout(timer);
  }, [userID]);

  const handleOnLoad = (autoc) => {
    autocompleteRef.current = autoc;
  };

  async function fetchLocation() {
    const response = await fetch("/api/getLocation/?loc_id=" + loc_id);
    const data = await response.json();
    setLocName(data[0].location_name);
    setAddr(data[0].location_address);
  }

  const fetchUser = async () => {
    const response = await fetch("/.auth/me");
    const data = await response.json();
    if (data.clientPrincipal != null) {
      setuserID(data.clientPrincipal.userId);
      setUsername(data.clientPrincipal.userDetails);
    }
  };

  async function deleteLocation() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this location?"
    );
    if (confirmDelete) {
      const response = await fetch("/api/deleteLocation/?loc_id=" + loc_id, {
        method: "DELETE",
      });
    }
  }

  async function editLocation() {
    const new_location_name =
      document.getElementById("edit-location-name").value;
    const new_address = document.getElementById("edit-address").value;

    const response = await fetch("/api/editLocation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location_id: loc_id,
        location_name: new_location_name,
        location_address: new_address,
      }),
    });
  }

  const handleLocChange = (e) => {
    setLocName(e.target.value);
  };

  const handleAddrChange = (e) => {
    setAddr(e.target.value);
  };
  return (
    <div className={classes.outerContainer}>
      {/* <div className={classes.navigationBar}>
                <Link className={classes.navWidget} to="/">
                    Home Page
                </Link>
                <Link className={classes.navWidget} to="/map">
                    Map Page
                </Link>
                <Link to="/locations" className={classes.navWidget}>
                    Saved Locations
                </Link>
                <a href="/.auth/logout" className={classes.navWidget}>
                    Logout
                </a>
            </div> */}
      <nav className={classes.navbar}>
        <ul className={classes.navbarList}>
          <li>
            <Link to="/" className={classes.link}>
              Home Page
            </Link>
          </li>
          <li>
            <Link to="/map" className={classes.link}>
              Map Page
            </Link>
          </li>
          <li>
            {userID === "Guest" ? null : (
              <Link to="/locations" className={classes.link}>
                Saved Locations
              </Link>
            )}
          </li>
          <li>
            {userID === "Guest" ? (
              <a href="/.auth/login/github" className={classes.link}>
                Login
              </a>
            ) : (
              <a href="/.auth/logout" className={classes.link}>
                Logout
              </a>
            )}
          </li>
          {userID !== "Guest" ? (
            <SubButton className={classes.notificationsButton} />
          ) : null}
        </ul>
      </nav>
      <div className={classes.mainContainer}>
        <h2 className={classes.editTitle}> Edit Location</h2>
        <label htmlFor="edit-location-name">Change location name</label>
        <input
          id="edit-location-name"
          value={loc_name}
          onChange={handleLocChange}
          className={classes.searchInput}
        ></input>

        <br />
        <label htmlFor="edit-address">Change address</label>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <Autocomplete onLoad={handleOnLoad}>
            <input
              id="edit-address"
              value={loc_addr}
              onChange={handleAddrChange}
              placeholder="Search for an address"
              className={classes.addressInput}
            />
          </Autocomplete>
        </LoadScript>

        <div className={classes.editWidgets}>
          <Link
            to="/locations"
            onClick={() => editLocation()}
            className={classes.saveWidget}
          >
            Save
          </Link>
          <Link
            to="/locations"
            onClick={() => deleteLocation()}
            className={classes.deleteWidget}
          >
            Delete
          </Link>
          <Link to="/locations" className={classes.cancelWidget}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LocationEdit;
