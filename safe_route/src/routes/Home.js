import React from "react";
import { Link } from "react-router-dom";
import classes from "./Home.module.css";
import { useState, useEffect } from "react";
import SubButton from "./SubButton";

function Home() {
  const [username, setUsername] = useState("Guest");
  const [userID, setUserID] = useState("Guest");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const response = await fetch("/.auth/me");
    const data = await response.json();
    if (data.clientPrincipal != null) {
      setUserID(data.clientPrincipal.userId);
      setUsername(data.clientPrincipal.userDetails);
    }
  };

  // Dummy data for recent crime incidents
  const recentCrimeIncidents = [
    { id: 1, location: "Location 1", description: "Description 1" },
    { id: 2, location: "Location 2", description: "Description 2" },
    { id: 3, location: "Location 3", description: "Description 3" },
  ];

  console.log(userID, username);
  return (
    <div className={classes.homeContainer}>
      <nav className={classes.navbar}>
        <ul className={classes.navbarList}>
          <li>
            <Link to="/map" className={classes.link}>
              Map page
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
      <div className={classes.contentContainer}>
        <video
          autoPlay
          muted
          loop
          id="myVideo"
          className={classes.backgroundVideo}
        >
          <source src="/videos/drone.mp4" type="video/mp4" />
          console.log("Hello");
        </video>
        <div className={classes.safeRouteContainer}>
          <h1 className={classes.heading}>SafeRoute</h1>
          <p>
            Welcome to SafeRoute - your trusted companion for campus safety.
            With SafeRoute, we've engineered a solution to prioritize students'
            safety by providing real-time tracking and visualizing crime-heavy
            areas on campus. SafeRoute alerts users when they approach
            danger-prone zones, enabling proactive route planning for safer
            journeys.{" "}
          </p>
        </div>

        {/* Recent Crime Incidents Section
        <div className={classes.crimeContainer}>
          <div className={classes.recentIncidents}>
            <h2 className={classes.crimeHeading}>
              Most Recent Crime Incidents
            </h2>
            <ul className={classes.incidentsList}>
              {recentCrimeIncidents.map((incident) => (
                <li key={incident.id} className={classes.incidentItem}>
                  <strong>Location:</strong> {incident.location}
                  <br />
                  <span>{incident.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
