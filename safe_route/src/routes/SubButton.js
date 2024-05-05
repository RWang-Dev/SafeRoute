import { useState, useEffect } from "react";
import classes from "./SubButton.module.css";
import { FaBell, FaBellSlash } from "react-icons/fa";

const VALID_PUBLIC_KEY = "BLoUEjtfjw0s52j4vll9wnzc7sWe5JJ6xjuJ6qQUNIQgETZD3-GlEbUPSFZ6Lrd7jgvig-uC2iFXxuTqmg-YrRw";

export default function SubButton({ userID, className }) {
    const [isSubscribed, setIsSubscribed] = useState(false);

    function urlB64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Ask the user for permission to send notifications
    function askPermission() {
        return new Promise(function (resolve, reject) {
            if (Notification.permission === "denied") {
                reject(new Error("The user has blocked notifications."));
            } else if (Notification.permission === "granted") {
                resolve("granted");
            } else {
                const permissionResult = Notification.requestPermission(function (result) {
                    resolve(result);
                });

                if (permissionResult) {
                    permissionResult.then(resolve, reject);
                }
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
                const checkSubExists = await fetch(`/api/getSubscription/?userID=${userID}`);
                const subData = await checkSubExists.json();
                if (subData.length === 0) {
                    const response = await fetch("/api/addSubscription", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userID, subscription: pushSubscription }),
                    });
                    const data = await response.json();
                    console.log("Received PushSubscription: ", "Response from the backend: ", data);
                }
                setIsSubscribed(true);
                return pushSubscription;
            });
    }

    function unsubscribeUser() {
        navigator.serviceWorker.getRegistration().then(function (registration) {
            if (registration) {
                registration.pushManager.getSubscription().then(function (subscription) {
                    if (subscription) {
                        subscription
                            .unsubscribe()
                            .then(function (successful) {
                                setIsSubscribed(!successful);
                                console.log("Unsubscription successful: ", successful);
                            })
                            .catch(function (error) {
                                console.log("Unsubscription failed: ", error);
                            });
                    }
                });
            }
        });
    }

    async function handleSubscription() {
        try {
            if (!isSubscribed) {
                await askPermission();
                await subscribeUserToPush();
            } else {
                unsubscribeUser();
            }
        } catch (error) {
            console.error("Failed to subscribe or unsubscribe:", error.message);
            alert("Failed to change notification settings: " + error.message);
        }
    }

    useEffect(() => {
        navigator.serviceWorker.getRegistration().then(function (registration) {
            if (registration) {
                registration.pushManager.getSubscription().then(function (subscription) {
                    setIsSubscribed(!!subscription);
                });
            }
        });
    }, []);

    return (
        <button className={className} onClick={handleSubscription}>
            {isSubscribed ? "Disable Notifications" : "Enable Notifications"} {isSubscribed ? <FaBell /> : <FaBellSlash />}
        </button>
    );
}
