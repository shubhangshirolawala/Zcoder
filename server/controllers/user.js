const User = require("../models/User");
// const Doctor = require('../models/doctors')
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { use } = require("../routes/user");


const updateProfile = async (req, res) => {
  const {
    user: { userName },
  } = req;

  let update = {};

  // Handle college update
  if (req.body.college) {
    update.college = req.body.college;
  }

  // Handle avatar upload
  if (req.file) {
    update.avatar = `uploads/${req.file.filename}`;
  }

  try {
    const user = await User.findOneAndUpdate({ userName }, update, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Profile update failed:", err);
    res
      .status(500)
      .json({ msg: "Profile update failed", error: err.message });
  }
};



const getUser = async (req, res) => {
  const {
    user: { userName },
  } = req;

  try {
    const userData = await User.findOne({ userName: userName });

    if (!userData) {
      return res.status(404).json({ msg: `No user found: ${userName}` });
    }

    return res.status(200).json({ userData });
  } catch (err) {
    console.error("Error retrieving user data:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  //   const {
  //     user: { userName },
  //   } = req;
  console.log(req.params);
  const { id: id } = req.params;
  const userData = await User.findOne({ _id:id });
  if (!userData) {
   return res.status(404).json({ msg: `No user found: ${id}` });
  }
return  res.status(200).json({ userData });
};

const addFriend = async (req, res) => {
  const {
    user: { userName },
  } = req;

  const { id: friendUserName } = req.params;

  const user = await User.findOneAndUpdate(
    { userName },
    { $push: { friends: friendUserName } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ user });
};

const removeFriend = async (req, res) => {
  const {
    user: { userName },
  } = req;

  const { id: friendUserName } = req.params;

  const user = await User.findOneAndUpdate(
    { userName },
    { $pull: { friends: friendUserName } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ user });
};

const getAllFriends = async (req, res) => {
  const {
    user: { userName },
  } = req;

  const user = await User.findOne({ userName });
  if (!user.friends.length) {
    res.status(200).json({ msg: "you will die lonely" });
  }
  res.status(200).json({ friends: user.friends });
};

const searchUsers = async (req, res) => {
  try {
    const { q } = req.query; // search text comes as query ?q=abc
    console.log("Search query:", q);
    if (!q) {
      return res.status(400).json({ msg: "Please provide a search query" });
    }

    
    const users = await User.find({
  userName: { $regex: `^${q}`, $options: "i" },
}).select("userName email");

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


module.exports = {
  getUser,
  getUserById,
  addFriend,
  removeFriend,
  getAllFriends,
  updateProfile,
  searchUsers,
};
