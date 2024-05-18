const express = require("express");
const router = express.Router();
const {
 getAllComments,getComment,deleteComment,updateComment,createComment
} = require("../controllers/comments");
router.get("/getAllComments/:id",getAllComments)
router.route("/getCommnet/:id").get(getComment).delete(deleteComment).patch(updateComment);
router.post("/createCommnet/:id", createComment);
module.exports = router;


