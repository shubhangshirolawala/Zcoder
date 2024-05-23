const express = require("express");
const router = express.Router();
const {
  getUser,
  getOtherUser,
  addFriend,
  removeFriend,
  getAllFriends,
} = require("../controllers/user");
router.get("/getUser", getUser);
router.get("/otherUser/:id", getOtherUser);
router.patch("/addFriend/:id", addFriend);
router.patch("/removeFriend/:id", removeFriend);
router.get("/getAllFriends", getAllFriends);

module.exports = router;
