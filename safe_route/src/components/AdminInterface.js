import React, { useState } from "react";
import classes from "./AdminInterface.module.css";

const AdminInterface = () => {
    const [notificationText, setNotificationText] = useState("");

    const handleNotificationSubmit = () => {
        console.log("Sending push notification:", notificationText);
        setNotificationText(""); 
    };

    return (
        <div className={classes.container}>
            <h2>Admin Interface</h2>
            <textarea
                className={classes.textarea} 
                value={notificationText}
                onChange={(e) => setNotificationText(e.target.value)}
                placeholder="Enter notification text"
            ></textarea>
            <button onClick={handleNotificationSubmit} className={classes.notiButton} >Send Notification</button>
        </div>
    );
};

export default AdminInterface;
