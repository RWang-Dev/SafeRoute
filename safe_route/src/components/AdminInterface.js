import React, { useState, useEffect } from "react";
import classes from "./AdminInterface.module.css";

const AdminInterface = () => {
  const [notificationText, setNotificationText] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getAllSubscriptions();
  }, []);

  async function getAllSubscriptions() {
    const response = await fetch("/api/getAllSubscriptions");
    const data = await response.json();
    setSubscriptions(data);
  }

  const handleNotificationSubmit = async () => {
    console.log("Sending push notification:", notificationText);
    for (const user_subscription of subscriptions) {
      await sendPush(notificationText, user_subscription.subscription);
    }
    setNotificationText("");
  };

  async function sendPush(message, subscription) {
    const response = await fetch("/api/sendNotification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: subscription,
        push_message: message,
      }),
    });
  }

  return (
    <div className={classes.container}>
      <h2>Admin Interface</h2>
      <textarea
        className={classes.textarea}
        value={notificationText}
        onChange={(e) => setNotificationText(e.target.value)}
        placeholder="Enter notification text"
      ></textarea>
      <button onClick={handleNotificationSubmit} className={classes.notiButton}>
        Send Notification
      </button>
    </div>
  );
};

export default AdminInterface;
