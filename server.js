const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const cron = require("node-cron");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));


// ==========================================
// VAPID KEYS FROM RENDER
// ==========================================

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
    console.error("❌ VAPID keys are missing!");
    process.exit(1);
}

webpush.setVapidDetails(
    "mailto:srujik710@gmail.com",
    publicKey,
    privateKey
);


// ==========================================
// PHONE SUBSCRIPTION
// ==========================================

let subscription = null;

app.post("/subscribe", (req, res) => {

    subscription = req.body;

    console.log("📱 Phone subscribed!");
    console.log(
        "Subscription endpoint:",
        subscription.endpoint
    );

    res.json({
        success: true,
        message: "Phone subscribed successfully."
    });
});


// ==========================================
// MORNING MESSAGES
// ==========================================

const morningNotes = [
    "Good morning nanaluuuuu ❤️ Eeroju nee day full happy ga undali.",
    "Morning nanaluuuuu 🥹💕 Nuvvu smile chesthe naa morning already perfect.",
    "Good morning bangaram ❤️ Time ki tinu, jagratthaga undu.",
    "Morning nanaaa 💗 Eeroju kuda nuvvu chala happy ga undali.",
    "Good morning moguduuu 😂❤️ Nee pellam nunchi daily attendance!",
    "Morning cutieee 🫶 Eeroju em jarigina, remember that I love you.",
    "Good morning nanaluuuuu 💕 Nuvvu ekkada unna naa thoughts lo maatram nuvve.",
    "Morning bangaram 🥺❤️ Eeroju oka big smile tho start cheyyi.",
    "Good morning nana ❤️ Busy ga unna water tagadam marchipoku!",
    "Morning nanaluuuuu 🫂💕 Sending you one virtual hug before your day starts."
];


// ==========================================
// SEND NOTIFICATION
// ==========================================

async function sendMorningNotification() {

    if (!subscription) {

        console.log("⚠️ No phone subscription available.");

        return;
    }

    const noteIndex =
        new Date().getDate() % morningNotes.length;

    const message =
        morningNotes[noteIndex];

    try {

        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: "Our World ❤️",
                body: message,
                icon: "/icons/icon-192.png",
                badge: "/icons/icon-192.png"
            })
        );

        console.log("🌅 AUTOMATIC NOTIFICATION SENT!");
        console.log("💌 Message:", message);

    } catch (error) {

        console.error("❌ NOTIFICATION FAILED");
        console.error("Status:", error.statusCode);
        console.error("Message:", error.message);
        console.error("Body:", error.body);

    }
}


// ==========================================
// MANUAL TEST ENDPOINT
// ==========================================

app.post("/send-notification", async (req, res) => {

    await sendMorningNotification();

    res.json({
        success: true,
        message: "Notification test triggered."
    });

});


// ==========================================
// VAPID PUBLIC KEY
// ==========================================

app.get("/vapid-public-key", (req, res) => {

    res.send(publicKey);

});


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.send(
        "Our World notification server is running ❤️"
    );

});


// ==========================================
// AUTOMATIC TEST — 9:50 PM IST
// ==========================================

cron.schedule(

    "50 21 * * *",

    async () => {

        console.log(
            "🔔 9:50 PM AUTOMATIC TEST STARTED!"
        );

        await sendMorningNotification();

    },

    {
        timezone: "Asia/Kolkata"
    }

);

console.log(
    "⏰ Automatic test scheduled for 9:50 PM IST."
);


// ==========================================
// RENDER PORT
// ==========================================

const PORT =
    process.env.PORT || 3000;

app.listen(

    PORT,

    "0.0.0.0",

    () => {

        console.log(
            `🌎 Our World server running on port ${PORT}`
        );

    }

);
