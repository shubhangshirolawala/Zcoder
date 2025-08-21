const express = require("express");
const router = express.Router();
const upload = require("../controllers/upload");
const authenticateUser = require("../middleware/authentication");
const {
  getUser,
  getUserById,
  addFriend,
  removeFriend,
  getAllFriends,
  updateProfile,
  searchUsers,
} = require("../controllers/user");


const { update } = require("../models/User");
router.get("/getUser", getUser);
router.get("/getUserById/:id", getUserById);
router.patch("/addFriend/:id", addFriend);
router.patch("/removeFriend/:id", removeFriend);
router.patch("/updateProfile",upload.single("avatar"),updateProfile);
router.get("/getAllFriends", getAllFriends);
router.get("/searchUsers",searchUsers);


module.exports = router;
