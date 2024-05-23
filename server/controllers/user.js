const User = require("../models/User");
// const Doctor = require('../models/doctors')
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { use } = require("../routes/user");

const getUser = async (req, res) => {
  const {
    user: { userName },
  } = req;
  const userData = await User.findOne({ userName });
  if (!userData) {
    res.status(404).json({ msg: `No user found: ${userName}` });
  }
  res.status(200).json({ userData });
};

const getOtherUser = async (req, res) => {
  //   const {
  //     user: { userName },
  //   } = req;
  const { id: userName } = req.params;
  const userData = await User.findOne({ userName });
  if (!userData) {
    res.status(404).json({ msg: `No user found: ${userName}` });
  }
  res.status(200).json({ userData });
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

module.exports = {
  getUser,
  getOtherUser,
  addFriend,
  removeFriend,
  getAllFriends,
};
