const Comment = require("../models/comments");
const { BadRequestError, NotFoundError } = require("../errors");
const comments = require("../models/comments");

const getAllComments = async (req, res) => {
  //   const {
  //     user: { userId },
  //     // params: { id: jobId },
  //   } = req;
  const { id: questionID } = req.params;
  const comments = await Comment.find({ commentedOn: questionID });
  res.status(200).json({ comments });
};

const createComment = async (req, res) => {
  const {
    user: { userName },
    // params: { id: jobId },
  } = req;
  // const { id: questionID } = req.params;
  const comment = await Comment.create({
    ...req.body,
    Author: userName,
    commentedOn: questionID,
  });
  res.status(201).json({ comment });
};

const getComment = async (req, res, next) => {
  const { id: commentID } = req.params;
  //   const {
  //     user: { userId },
  //     // params: { id: jobId },
  //   } = req;
  const comment = await Comment.findOne({ _id: commentID });
  if (!comment) {
    return res.status(404).json({ msg: `No comment with id : ${commentID}` });
  }

  res.status(200).json({ comment });
};
const deleteComment = async (req, res, next) => {
  const { id: commentID } = req.params;
//   const {
//     user: { userId },
//     // params: { id: jobId },
//   } = req;
  const comment = await Comment.findOneAndDelete({ _id: commentID});
  if (!comment) {
    return res.status(404).json({ msg: `No comment with id : ${commentID}` });
  }
  res.status(200).json({ comment });
};
const updateComment = async (req, res, next) => {
  const { id: commentID } = req.params;
  const {
    user: { userName },
    // params: { id: jobId },
  } = req;
  const comment = await Comment.findOneAndUpdate(
    { _id: commentID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

//   if (!task) {
//     return res.status(404).json({ msg: `No task with id : ${taskID}` });
//   }

  res.status(200).json({ comment });
};

module.exports = {
  getAllComments,
  getComment,
  deleteComment,
  updateComment,
  createComment,
};
