const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const config = require('./../config/config');
const { tokenTypes } = require('./../config/tokens');
const { Token } = require('../model/token.model');

 
// Function to generate a JWT for a given user ID
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  // Payload includes subject (user ID), issued at time, expiration time, and token type
  const payload = {
    sub: userId,
    iat: dayjs().unix(), // Issued at: current Unix timestamp
    exp: expires.unix(), // Expires in 30 minutes
    type, // Token type: access
  };
 
  // Sign the token with the secret key
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

 
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    user: payload.sub,
    type,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

const generateAuthTokens = async (userId) => {
  //console.log(config.jwt.accessExpirationMinutes);
  const accessTokenExpires = dayjs().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );
  const accessToken = generateToken(
    userId,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  const refreshTokenExpires = dayjs().add(
    config.jwt.refreshExpirationDays,
    'days'
  );
  const refreshToken = generateToken(
    userId,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(refreshToken, userId, refreshTokenExpires, tokenTypes.REFRESH);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
  saveToken,
  verifyToken
};
