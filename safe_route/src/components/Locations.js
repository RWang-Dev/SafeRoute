import React from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import classes from "./Locations.module.css";

function Locations() {
  return (
    <div className={classes.outerContainer}>
      <div className={classes.mainContainer}>
        <div className={classes.savedLocations}>
          <h2>Saved Locations</h2>
          <div className={classes.locationItem}>
            <div className={classes.locationName}>Location 1</div>
            <div className={classes.icons}>
              <FaEdit className={classes.editIcon} />
              <FaTrash className={classes.deleteIcon} />
            </div>
          </div>
        </div>
        <div className={classes.createLocation}>
          <h2>Create New Location</h2>
          <input type="text" placeholder="Type in address" />
          <br />
          <br />
          <input type="text" placeholder="Add Custom Name" />
          <br />
          <br />
          <button>Save Location</button>
        </div>
      </div>
    </div>
  );
}

export default Locations;
