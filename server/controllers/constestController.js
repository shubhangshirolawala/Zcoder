const axios = require("axios");

const fetchContests = async (req, res) => {
  try {
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
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: "Failed to fetch contests" });
  }
};

const addContest = async (req, res) => {
  try {
    // Get contest details from request body
    const { name, start_time, end_time } = req.body;

    // Save contest details to the database (not implemented here)

    res.status(201).json({ message: "Contest added successfully" });
  } catch (error) {
    console.error("Error adding contest:", error);
    res.status(500).json({ error: "Failed to add contest" });
  }
};

const scheduleReminder = async (req, res) => {
  try {
    // Get reminder details from request body
    const { email, contestName, startTime, reminderTime } = req.body;

    // Implement logic to schedule reminder (similar to previous implementation)

    res.json({ message: "Reminder scheduled" });
  } catch (error) {
    console.error("Error setting reminder:", error);
    res.status(500).json({ error: "Failed to set reminder" });
  }
};

module.exports = { fetchContests, addContest, scheduleReminder };
