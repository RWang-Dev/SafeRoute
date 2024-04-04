import React from "react";
import "./Locations.css";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

function Locations() {
  return (
    <div className="outer-container">
        <div className="main-container">
            <div className="saved-locations">
                <h2>Saved Locations</h2>
                <div className="location-item">
                <div className="location-name">Location 1</div>
                <div className="icons">
                    <FaEdit className="edit-icon" />
                    <FaTrash className="delete-icon" />
                </div>
                </div>
            </div>
            <div className="create-location">
                <h2>Create New Location</h2>
                <input type="text" placeholder="Type in address" /><br/><br/>
                <input type="text" placeholder="Add Custom Name" /><br/><br/>
                <button>Save Location</button>
            </div>
        </div>
    </div>
  );
}

export default Locations;
