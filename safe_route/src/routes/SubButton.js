// Author: Daniel Kluver
import classes from "./SubButton.module.css";
import { FaBell } from "react-icons/fa";
// generate a public, private key pair here: https://web-push-codelab.glitch.me/ copy the public below, save the private for later.
const VALID_PUBLIC_KEY =
  "BLoUEjtfjw0s52j4vll9wnzc7sWe5JJ6xjuJ6qQUNIQgETZD3-GlEbUPSFZ6Lrd7jgvig-uC2iFXxuTqmg-YrRw";

export default function SubButton({ className }) {
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

  //https://web.dev/articles/push-notifications-subscribing-a-user
  // this handles both up-to-date browsers where requestPermission is async, and older browsers where it's callback

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

  //https://web.dev/articles/push-notifications-subscribing-a-user again.
  function subscribeUserToPush() {
    return navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(VALID_PUBLIC_KEY),
        };

        return registration.pushManager.subscribe(subscribeOptions);
      })
      .then(async function (pushSubscription) {
        // we'll want to do something different here -- like phone home.
        console.log("subscribing");
        console.log(pushSubscription);
        const jsonString = JSON.stringify(pushSubscription);
        const encodedJsonString = encodeURIComponent(jsonString);

        const url = `/api/beepbeep/?data=${encodedJsonString}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(
          "Received PushSubscription: ",
          "Response from the backend: ",
          data
        );

        return pushSubscription;
      });
  }

  async function click() {
    await askPermission();
    await subscribeUserToPush();
  }

  return (
    <button className={className} onClick={click}>
      Enable <FaBell />
    </button>
  );
}
