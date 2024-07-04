  const User = require('../models/User');
  const { StatusCodes } = require('http-status-codes');
  const { BadRequestError, UnauthenticatedError } = require('../errors');

  const register = async (req, res) => {
    try {
      const { email, password, userName} = req.body;
       const avatar = req.file ? req.file.path : null;

      const user = await User.create({ email, password, userName, avatar });
      console.log(user)
      const token = user.createJWT();
      res.status(StatusCodes.CREATED).json({ user: { userName: user.userName, email: user.email, avatar: user.avatar }, token });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };

  const login = async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
      throw new BadRequestError('Please provide username and password');
    }

    const user = await User.findOne({ userName });
    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { userName: user.userName, avatar: user.avatar }, token });
  };

  module.exports = {
    register,
    login,
  };
