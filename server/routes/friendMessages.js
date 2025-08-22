const {getMessages , addMessage} = require("../controllers/messageController")
const router = require("express").Router();

// store a new message
router.post("/messages/send", addMessage); // instead of /addmsg

// get message history between two users
router.post("/messages/history", getMessages); // instead of /getmsg

module.exports = router;
