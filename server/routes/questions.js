const express = require("express");
const router = express.Router();
const {
  getAllBookmarks,
  getAllQuestions,
  createQuestion,
  deleteQuestion,
} = require("../controllers/questions");
router.post("/getAllBookmarks", getAllBookmarks);
router.post("/getAllQuestions", getAllQuestions);
router.post("/createQuestion", createQuestion);
router.delete("/deleteQuestion/:id",deleteQuestion);

module.exports = router;
