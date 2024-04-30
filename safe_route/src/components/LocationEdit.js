import React from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import classes from "./LocationEdit.module.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function LocationEdit() {
    const { loc_id } = useParams();
    const [locations, setLocations] = useState([]);
    const [username, setUsername] = useState("Guest");
    const [userID, setuserID] = useState("Guest");
    const [loc_name, setLocName] = useState("Loc");
    const [loc_addr, setAddr] = useState("Loc");
    let navigate = useNavigate();

    function handleBack() {
        navigate(-1);
    }

    useEffect(() => {
        fetchUser();
        fetchLocation();
    }, []);

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
        const confirmDelete = window.confirm("Are you sure you want to delete this location?");
        if (confirmDelete) {
            const response = await fetch("/api/deleteLocation/?loc_id=" + loc_id, {
                method: "DELETE",
            });
        }
    }

    async function editLocation() {
        const new_location_name = document.getElementById("edit-location-name").value;
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
            <div className={classes.mainContainer}>
                <h1 className={classes.editTitle}> Edit Location</h1>
                <label htmlFor="edit-location-name">Location name</label>
                <input id="edit-location-name" value={loc_name} onChange={handleLocChange}></input>

                <label htmlFor="edit-address">Address</label>
                <textarea id="edit-address" value={loc_addr} onChange={handleAddrChange}></textarea>
                <div className={classes.editWidgets}>
                    <Link to="/locations" onClick={() => editLocation()} className={classes.saveWidget}>
                        Save
                    </Link>
                    <Link to="/locations" onClick={() => deleteLocation()} className={classes.deleteWidget}>
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
