const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const app = express();
const port = 5000;

// Middleware to parse JSON
app.use(express.json());

// Example route to fetch contest data from an external API
app.get("/api/contests", async (req, res) => {
  try {
    // Replace with actual API URLs
    const codeforcesResponse = await axios.get(
      "https://codeforces.com/api/contest.list"
    );
    const contests = codeforcesResponse.data.result.map((contest) => ({
      name: contest.name,
      start_time: new Date(contest.startTimeSeconds * 1000).toISOString(),
      end_time: new Date(
        contest.startTimeSeconds * 1000 + 7200000
      ).toISOString(), // Assuming a 2-hour duration
    }));
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contests" });
  }
});

// Function to send reminder emails
const sendReminderEmail = (email, contestName, startTime) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Contest Reminder",
    text: `Reminder: The contest ${contestName} starts at ${startTime}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Example route to schedule a reminder
app.post("/api/schedule-reminder", (req, res) => {
  const { email, contestName, startTime } = req.body;

  // Schedule email (for simplicity, using setTimeout here)
  const reminderTime = new Date(startTime).getTime() - Date.now() - 3600000; // 1 hour before start
  setTimeout(
    () => sendReminderEmail(email, contestName, startTime),
    reminderTime
  );

  res.json({ message: "Reminder scheduled" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
