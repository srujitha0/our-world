async function enablePushNotifications() {
    try {
        if (!("serviceWorker" in navigator)) {
            console.log("Service workers not supported.");
            return;
        }

        if (!("PushManager" in window)) {
            console.log("Push notifications not supported.");
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.log("Notification permission denied.");
            return;
        }

        const registration =
            await navigator.serviceWorker.ready;

        const response =
            await fetch("/vapid-public-key");

        const publicKey =
            await response.text();

        let subscription =
            await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription =
                await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey:
                        urlBase64ToUint8Array(publicKey)
                });
        }

        await fetch("/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(subscription)
        });

        console.log("❤️ Push notification subscription saved!");
        console.log("Subscription endpoint:", subscription.endpoint);

    } catch (error) {
        console.error(
            "Push notification setup failed:",
            error
        );
    }
}

function urlBase64ToUint8Array(base64String) {

    const padding =
        "=".repeat(
            (4 - base64String.length % 4) % 4
        );

    const base64 =
        (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");

    const rawData =
        window.atob(base64);

    return Uint8Array.from(
        [...rawData].map(char =>
            char.charCodeAt(0)
        )
    );
}

window.addEventListener("load", () => {
    enablePushNotifications();
});