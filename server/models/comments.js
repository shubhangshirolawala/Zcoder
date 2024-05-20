const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: [true, "Please Provide Comment"],
    },
    Author: {
      type: String,
      required: [true, "Please Provide User"],
    },
    commentedOn: {
      type: mongoose.Types.ObjectId,
      ref: "Question",
      required: [true, "question id Not provided"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", CommentSchema);
