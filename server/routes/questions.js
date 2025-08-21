const express = require("express");
const router = express.Router();
const {
  getAllBookmarks,
  getAllQuestions,
  createQuestion,
  deleteBookmark,
} = require("../controllers/questions");

router.delete("/deleteBookmark/:id", deleteBookmark);
router.post("/getAllBookmarks/:userId?", getAllBookmarks);
router.post("/getAllQuestions", getAllQuestions);
router.post("/createQuestion", createQuestion);

module.exports = router;
