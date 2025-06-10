const User = require('../model/user.model');
const { ApiError } = require('../utils/ApiError');
const httpStatus = require('http-status');
const EventEmitter = require('../utils/EventEmitter');

const createUser = async (userBody) => {
  const isEmailTaken = await User.isEmailTaken(userBody.email);
  if (isEmailTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already Taken');
  }

  const user = await User.create(userBody);
  // Send welcome email
  EventEmitter.emit('signup', user);
  return user;
};

const getUser = async () => {
  const user = await User.find({});
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

module.exports = {
  createUser,
  getUser,
  getUserByEmail,
  getUserById,
};
