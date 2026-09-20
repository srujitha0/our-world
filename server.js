const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
    console.error("❌ VAPID keys are missing!");
}

webpush.setVapidDetails(
    "mailto:srujik710@gmail.com",
    publicKey,
    privateKey
);

let subscription = null;

// PHONE SUBSCRIPTION
app.post("/subscribe", (req, res) => {
    subscription = req.body;

    console.log("📱 Phone subscribed!");
    console.log("Subscription endpoint:", subscription.endpoint);

    res.json({
        success: true,
        message: "Phone subscribed successfully."
    });
});

// SEND NOTIFICATION
app.post("/send-notification", async (req, res) => {
    if (!subscription) {
        return res.status(400).json({
            success: false,
            message: "No phone is subscribed yet."
        });
    }

    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: "Our World ❤️",
                body: "Good morning nanaluuuuu 💕",
                icon: "/icons/icon-192.png",
                badge: "/icons/icon-192.png"
            })
        );

        console.log("🔔 Notification sent successfully!");

        res.json({
            success: true,
            message: "Notification sent successfully."
        });

    } catch (error) {
        console.error("❌ Notification failed:", error);

        res.status(500).json({
            success: false,
            message: "Notification failed.",
            error: error.message
        });
    }
});

// VAPID PUBLIC KEY
app.get("/vapid-public-key", (req, res) => {
    res.send(publicKey);
});

// HEALTH CHECK
app.get("/", (req, res) => {
    res.send("Our World notification server is running ❤️");
});

// RENDER PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌎 Our World server running on port ${PORT}`);
});