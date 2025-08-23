const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    message: { text: { type: String, required: true } },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // [from, to]
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: String }, // optional if you want to extend to group chats later
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
