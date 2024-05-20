const express = require("express");
const router = express.Router();
const {
  fetchContests,
  addContest,
  scheduleReminder,
} = require("../controllers/contestController");

router.get("/", fetchContests);
router.post("/add", addContest);
router.post("/schedule-reminder", scheduleReminder);

module.exports = router;
