const express = require("express");
const router = express.Router();
const {
  getAllBookmarks,
  getAllQuestions,
  createQuestion,
  deleteQuestion,
} = require("../controllers/questions");
router.get("/getAllBookmarks", getAllBookmarks);
router.get("/getAllQuestions", getAllQuestions);
router.post("/createQuestion", createQuestion);
// router.delete("/deleteQuestion/:id",deleteQuestion);

module.exports = router;
