const Question = require("../models/questions");
const { BadRequestError, NotFoundError } = require("../errors");

const createQuestion = async (req, res) => {
  const {
    user: { userId },
    // params: { id: jobId },
  } = req;
  const question = await Question.create({ ...req.body, Author: userId });
  res.status(201).json({ question });
};

const getAllQuestions = async (req, res) => {
  const questions = await Question.find({});
  res.status(200).json({ questions });
};

const getAllBookmarks = async (req, res, next) => {
  // const { id: taskID } = req.params;
  let userId;

    if (req.params.userId) {
      //if passed as params and want users bookmarks
      userId = req.params.userId;
      
    } else {
      //or no params passed so current users bookmarks
      userId = req.user.userId;
    }

    console.log("userId", userId);

  const bookmarks = await Question.find({ Author: userId });
  // console.log(bookmarks);
  if (!bookmarks) {
    return res.status(404).json({ msg: `No bookmarks created : ${userId}` });
  }

  res.status(200).json({ bookmarks });
};



const deleteBookmark = async (req, res, next) => {console.log("andar")
  const { id } = req.params;
  console.log(id);
  const {
    user: { userName },
  } = req;
  const bookmark = await Question.findOneAndDelete({ _id: id, Author: userName });
  if (!bookmark) {
    return res.status(404).json({ msg: `No bookmark with id : ${id}` });
  }
  res.status(200).json({ msg: 'Bookmark deleted', bookmark });
};
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
  deleteBookmark,
};
