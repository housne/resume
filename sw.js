importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js"
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute(["/", "/index.html"]);
  workbox.routing.registerRoute(
    "https://housne.github.io/resume/resume.pdf",
    new workbox.strategies.CacheFirst({
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        })
      ]
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
