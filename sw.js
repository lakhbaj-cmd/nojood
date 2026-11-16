// Mizan service worker: makes the app open fast and work offline.
// When you change any file, raise the version number so phones get the update.
const VERSION = "nojood-v21";
const FILES = [
  "./", "index.html", "start.html", "portal.html", "dietitian.html",
  "style.css", "i18n.js", "recipes.js", "grocery.js", "db.js", "app.js", "manifest.webmanifest", "manifest-en.webmanifest", "manifest-dietitian.webmanifest",
  "icon-192.png", "icon-512.png", "icon-180.png", "logo-mark.svg", "pro-icon-192.png", "pro-icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first (so updates show right away), fall back to the saved copy when offline
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("portal.html")))
  );
});

// Phone notifications (sent by the "push" server function)
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data.json(); } catch (x) { d = { title: "نجود للتغذية", body: e.data ? e.data.text() : "" }; }
  const pro = /dietitian/.test(d.url || "");
  e.waitUntil(self.registration.showNotification(d.title || "نجود للتغذية", {
    body: d.body || "", icon: pro ? "pro-icon-192.png" : "icon-192.png", badge: "icon-192.png",
    tag: d.tag, dir: "rtl", lang: "ar", data: { url: d.url || "portal.html" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "portal.html", self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(ws => {
    for (const w of ws) if (w.url.split("?")[0] === url && "focus" in w) return w.focus();
    return clients.openWindow(url);
  }));
});
