const userService = require('./user.service');
const httpStatus = require('http-status');
const { ApiError } = require('../utils/ApiError');
const { tokenService } = require('.');
const { tokenTypes } = require('../config/tokens');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');

const maxAttemptByIpUsername = 100;
const maxAttemptsPerDay = 10;
const maxAttemptsPerEmail = 50;

const login = async (email, password, ipAddr) => {
    
 

  const emailIpBruteLimiter = new RateLimiterMongo({
    storeClient: mongoose.connection,
    points: maxAttemptByIpUsername,
    duration: 60 * 10,
    blockDuration: 60 * 60 * 24,
    dbName: "blogstest"
  });

  const slowerBruteLimiter = new RateLimiterMongo({
    storeClient: mongoose.connection,
    points: maxAttemptsPerDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24,
    dbName: "blogstest"
  });

  const emailBruteLimiter = new RateLimiterMongo({
    storeClient: mongoose.connection,
    points: maxAttemptsPerEmail,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24,
    dbName: "blogstest"
  });
  
  const promises = [slowerBruteLimiter.consume(ipAddr)];
  const user = await userService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    user && promises.push([emailIpBruteLimiter.consume(`${email}_${ipAddr}`), 
      emailBruteLimiter.consume(email)]);
    await Promise.all(promises);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const refreshAuthToken = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    return tokenService.generateAuthTokens(user.id);
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  login,
  refreshAuthToken,
}
