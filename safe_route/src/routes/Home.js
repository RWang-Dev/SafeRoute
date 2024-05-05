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

    return (
        <div className={classes.homeContainer}>
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
                    {userID !== "Guest" ? <SubButton userID={userID} className={classes.notificationsButton} /> : null}
                </ul>
            </nav>
            <div className={classes.contentContainer}>
                <video autoPlay muted loop id="myVideo" className={classes.backgroundVideo} onContextMenu={(e) => e.preventDefault()}>
                    <source src="/videos/drone.mp4" type="video/mp4" />
                </video>

                <div className={classes.safeRouteContainer}>
                    <h1 className={classes.heading}>SafeRoute</h1>
                    <br />
                    <p>
                        Welcome to SafeRoute - your trusted companion for campus safety. With SafeRoute, 
                        we've engineered a solution to prioritize student safety by providing real-time tracking and 
                        visualization of crime-heavy areas on campus. SafeRoute alerts users when they approach danger-prone zones,
                        enabling proactive route planning for safer journeys.{" "}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
