/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("push", async (event) => {
  const data = event.data.json();
  //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
  self.registration.showNotification("Vibration Sample", {
    body: data.msg,
    icon: "../images/touch/chrome-touch-icon-192x192.png",
    data: { key: "value" },
  });
});

addEventListener("notificationclick", (event) => {
  // get the data and do something with it -- for example, you could use clients.openWindow (per: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event)
  console.log(event.notification.data);
  event.notification.close();
  /* eslint-disable-next-line no-undef */
  return clients.openWindow("/");
});

console.log("I'M IN!!!!");
