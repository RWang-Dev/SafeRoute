/* eslint-disable no-restricted-globals */
import {precacheAndRoute} from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = "v1";
const urlsToCache = [
    "index.html",
    "offline.html",
    "favicon.ico",
    "logo192.png",
    "logo512.png",
    // "/",
    // "/src/App.css",
    // "/src/index.css",
    // "/src/App.js",
    // "/src/index.js",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch(() => caches.match("offline.html"))
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("push", async (event) => {
    const data = await event.data.json();
    //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification

    self.registration.showNotification("Alert message from SafeRoute", {
        body: `${data.msg}`,
        data: "This is a test message",
    });
});

self.addEventListener("notificationclick", (event) => {
    // get the data and do something with it -- for example, you could use clients.openWindow (per: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event)
    console.log(event.notification.data);
    event.notification.close();
    /* eslint-disable-next-line no-undef */
    return clients.openWindow("/");
});

console.log("I'M IN!!!!");
