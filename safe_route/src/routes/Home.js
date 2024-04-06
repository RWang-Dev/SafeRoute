import React from "react";
import { Link } from "react-router-dom";
import classes from "./Home.module.css"; // Import CSS classes

function Home() {
    // Dummy data for recent crime incidents
    const recentCrimeIncidents = [
        { id: 1, location: "Location 1", description: "Description 1" },
        { id: 2, location: "Location 2", description: "Description 2" },
        { id: 3, location: "Location 3", description: "Description 3" }
    ];

    return (
        <div className={classes.homeContainer}>
            <nav className={classes.navbar}>
                <ul className={classes.navbarList}>
                    <li>
                        <Link to="/map" className={classes.link}>
                            Go to map page
                        </Link>
                    </li>
                    <li>
                        <Link to="/locations" className={classes.link}>
                            Go to saved Locations
                        </Link>
                    </li>
                    {/* Add more navigation links here*/}
                </ul>
            </nav>
            <div className={classes.contentContainer}>
                <h1 className={classes.heading}>Home Page</h1>
                {/* Recent Crime Incidents Section */}
                <div className={classes.recentIncidents}>
                    <h2 className={classes.subHeading}>Most Recent Crime Incidents</h2>
                    <ul className={classes.incidentsList}>
                        {recentCrimeIncidents.map(incident => (
                            <li key={incident.id} className={classes.incidentItem}>
                                <strong>Location:</strong> {incident.location}<br />
                                <span>{incident.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
