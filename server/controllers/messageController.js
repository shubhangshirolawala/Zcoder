
const Messages = require("../models/Message");
const mongoose = require("mongoose");
module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const messages = await Messages.find({
      users: { $all: [from, to] },
    }).sort({ createdAt: 1 });

    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
      createdAt: msg.createdAt,
      _id: msg._id,
    }));

    res.status(200).json(projectedMessages);
  } catch (ex) {
    console.error("Error in getMessages:", ex);
    res.status(500).json({ msg: "Internal server error", error: ex.message });
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(from) || !mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({ msg: "Invalid user IDs" });
    }

    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    return res.status(201).json({ msg: "Message added successfully", data });
  } catch (ex) {
    console.error("Error in addMessage:", ex);
    return res.status(500).json({ msg: "Internal server error", error: ex.message });
  }
};

