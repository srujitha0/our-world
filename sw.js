const CACHE_NAME = "our-world-v2";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/icons/icon-512.png"
];

// INSTALL — cache the PWA files
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

// ACTIVATE — remove old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

// FETCH — use cached files when available
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});

// NOTIFICATION CLICK
self.addEventListener("notificationclick", event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then(clientList => {

            for (const client of clientList) {
                if ("focus" in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow("/");
            }
        })
    );
});


// PUSH NOTIFICATION
self.addEventListener("push", event => {
    console.log("🔥 PUSH EVENT RECEIVED!");
    
    let data = {};

    try {
        data = event.data ? event.data.json() : {};
    } catch (error) {
        console.error("Push data error:", error);
    }

    const title = data.title || "Our World ❤️";

    const options = {
        body: data.body || "Good morning nanaluuuuu 💕",
        icon: data.icon || "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        vibrate: [200, 100, 200],
        data: {
            url: "/"
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});