const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const config = require('./../config/config');
const { tokenTypes } = require('./../config/tokens');
 
// Function to generate a JWT for a given user ID
const generateAuthToken = (userId) => {
  // Payload includes subject (user ID), issued at time, expiration time, and token type
  const payload = {
    sub: userId,
    iat: dayjs().unix(), // Issued at: current Unix timestamp
    exp: dayjs().add(config.jwt.jwtExpirationMinutes, 'minutes').unix(), // Expires in 30 minutes
    type: tokenTypes.ACCESS, // Token type: access
  };
 
  // Sign the token with the secret key
  return jwt.sign(payload, config.jwt.secret);
};
 
module.exports = {
  generateAuthToken,
};