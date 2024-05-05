import { useState, useEffect } from "react";
import classes from "./SubButton.module.css";
import { FaBell, FaBellSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
// generate a public, private key pair here: https://web-push-codelab.glitch.me/ copy the public below, save the private for later.
const VALID_PUBLIC_KEY =
  "BLoUEjtfjw0s52j4vll9wnzc7sWe5JJ6xjuJ6qQUNIQgETZD3-GlEbUPSFZ6Lrd7jgvig-uC2iFXxuTqmg-YrRw";

export default function SubButton({ userID, className }) {
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    checkSubExists();
  }, []);

  async function checkSubExists() {
    const checkSubExits = await fetch("/api/getSubscription/?userID=" + userID);
    const subData = await checkSubExits.json();
    if (subData.length == 0) {
      setNotifications(false);
      return false;
    } else {
      setNotifications(true);
      return true;
    }
  }
  //https://github.com/GoogleChromeLabs/web-push-codelab/blob/master/app/scripts/main.js
  function urlB64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function askPermission() {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      if (permissionResult !== "granted") {
        throw new Error("We weren't granted permission.");
      }
    });
  }

  function subscribeUserToPush() {
    return navigator.serviceWorker
      .register("/service-worker.js", { scope: "./" })
      .then(function (registration) {
        return navigator.serviceWorker.ready;
      })
      .then(function (registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(VALID_PUBLIC_KEY),
        };

        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(async function (pushSubscription) {
        console.log("subscribing");
        console.log(pushSubscription);
        const jsonString = JSON.stringify(pushSubscription);
        const encodedJsonString = encodeURIComponent(jsonString);

        const subExists = await checkSubExists();
        if (subExists == false) {
          const response = await fetch("/api/addSubscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userID: userID,
              subscription: pushSubscription,
            }),
          });
          const data = await response.json();
          console.log(
            "Received PushSubscription: ",
            "Response from the backend: ",
            data
          );
          setNotifications(true);

          return pushSubscription;
        } else {
          const response = await fetch("/api/deleteSubscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userID: userID,
            }),
          });
          const data = await response.json();
          console.log("Deleted Subscription", data);
          setNotifications(false);
          return "deleted sub";
        }
      });
  }

  async function handleSubscription() {
    if (!isSubscribed) {
      await askPermission();
      await subscribeUserToPush();
    } else {
      unsubscribeUser();
    }
  }

  useEffect(() => {
    navigator.serviceWorker.getRegistration().then(function (registration) {
      if (registration) {
        registration.pushManager
          .getSubscription()
          .then(function (subscription) {
            setIsSubscribed(!!subscription);
          });
      }
    });
  }, []);

  return (
    <button className={className} onClick={click}>
      Notifications {notifications ? <FaBellSlash /> : <FaBell />}
    </button>
  );
}
