const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const publicKey =
  "BP-LaULTa60Pu-fDh3VjpnCyT7u5DYxzb7TxzlkbWq0FYYbQN1Sr3eHKj9Mj0LuuxqFzyL4yshSD5qRomwf_M5g";

const privateKey = "kk5I_vHaElMqjW9Xnqmq-YSRDBKGTSpc82duP16B8e8";

webpush.setVapidDetails(
  "mailto:srujik710@gmail.com",
  publicKey,
  privateKey
);

let subscription = null;

app.post("/subscribe", (req, res) => {
  subscription = req.body;
  console.log("Phone subscribed!");
  res.json({ success: true });
});

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
        icon: "/icons/icon-192.png"
      })
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Notification failed."
    });
  }
});

app.get("/vapid-public-key", (req, res) => {
  res.send(publicKey);
});

const PORT = 3000;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Our World server running on port ${PORT}`);
});