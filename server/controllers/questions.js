const Question = require("../models/questions");
const { BadRequestError, NotFoundError } = require("../errors");

const createQuestion = async (req, res) => {
  const {
    user: { userName },
    // params: { id: jobId },
  } = req;
  const question = await Question.create({ ...req.body, Author: userName });
  res.status(201).json({ question });
};

const getAllQuestions = async (req, res) => {
  const questions = await Question.find({});
  res.status(200).json({ questions });
};

const getAllBookmarks = async (req, res, next) => {
  // const { id: taskID } = req.params;
  const {
    user: { userName },
    // params: { id: jobId },
  } = req;
  const bookmarks = await Question.find({ Author: userName });
  if (!bookmarks) {
    return res.status(404).json({ msg: `No bookmarks created : ${userName}` });
  }

  res.status(200).json({ bookmarks });
};
// const deleteTask = async (req, res, next) => {
//   const { id: taskID } = req.params;
//   const {
//     user: { userId },
//     // params: { id: jobId },
//   } = req;
//   const task = await Task.findOneAndDelete({ _id: taskID, createdBy: userId });
//   if (!task) {
//     return res.status(404).json({ msg: `No task with id : ${taskID}` });
//   }
//   res.status(200).json({ task });
// };
// const updateTask = async (req, res, next) => {
//   const { id: taskID } = req.params;
//   const {
//     user: { userId },
//     // params: { id: jobId },
//   } = req;
//   const task = await Task.findOneAndUpdate(
//     { _id: taskID, createdBy: userId },
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (!task) {
//     return res.status(404).json({ msg: `No task with id : ${taskID}` });
//   }

//   res.status(200).json({ task });
// };

module.exports = {
  getAllBookmarks,
  getAllQuestions,
  createQuestion,
  deleteQuestion,
};
