const User = require("../models/User");
// const Doctor = require('../models/doctors')
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user, token });
  } catch (error) {
    res.json({ error });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    throw new BadRequestError("Please provide name and password");
  }
  const user = await User.findOne({ userName });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token });
};

module.exports = {
  register,
  login,
};
