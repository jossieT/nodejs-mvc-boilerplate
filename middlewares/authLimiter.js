const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const { ApiError } = require('./../utils/ApiError');
const httpStatus = require('http-status');
const config = require('../config/config');

console.log('perIpUser', config.rateLimiter.maxAttemptsByIpUsername);
console.log('perDay', config.rateLimiter.maxAttemptsPerDay);
console.log('perEmail', config.rateLimiter.maxAttemptsPerEmail);
console.log('type',typeof(config.rateLimiter.maxAttemptsPerEmail));


const emailIpBruteLimiter = new RateLimiterMongo({
  storeClient:mongoose.connection,
  points:config.rateLimiter.maxAttemptsByIpUsername,
  duration:60*10,
  blockDuration:60*60*24,
  dbName:"blogstest"
})

const slowerBruteLimiter = new RateLimiterMongo({
  storeClient:mongoose.connection,
  points:config.rateLimiter.maxAttemptsPerDay,
  duration:60*60*24,
  blockDuration:60*60*24,
  dbName:"blogstest"
})

const emailBruteLimiter = new RateLimiterMongo({
storeClient:mongoose.connection,
points:config.rateLimiter.maxAttemptsPerEmail,
duration:60*60*24,
blockDuration:60*60*24,
dbName:"blogstest"
})

const authLimiter = async (req, res, next) => {
 // const ipAddr = req.connection.remoteAddress;
  const ipAddr = req.connection.remoteAddress === "::1" ? "127.0.0.1" : req.connection.remoteAddress;
  const email = req.body.email
  const emailIpKey = `${email}_${ipAddr}`;
  const [slowerBruteRes, emailIpRes,emailRes] = await Promise.all([
    slowerBruteLimiter.get(ipAddr),
    emailIpBruteLimiter.get(emailIpKey),
    emailBruteLimiter.get(email)
  ]);

  let retrySeconds = 0;

  if (
    emailIpRes &&
    emailIpRes.consumedPoints >= config.rateLimiter.maxAttemptsByIpUsername
  ) {
    retrySeconds = Math.floor(emailIpRes.msBeforeNext / 1000) || 1;
  } else if (
    slowerBruteRes &&
    slowerBruteRes.consumedPoints >= config.rateLimiter.maxAttemptsPerDay
  ) {
    retrySeconds = Math.floor(slowerBruteRes.msBeforeNext / 1000) || 1;
  } else if (
    emailIpRes &&
    emailIpRes.consumedPoints >= config.rateLimiter.maxAttemptsByIpUsername
  ) {
    retrySeconds = Math.floor(emailIpRes.msBeforeNext / 1000) || 1;
  } else if(emailRes&& emailRes.consumedPoints>= config.rateLimiter.maxAttemptsPerEmail){
    retrySeconds = Math.floor(emailRes.msBeforeNext / 1000) || 1;
  }

  console.log(retrySeconds);
  
  if (retrySeconds > 0) {
    res.set('Retry-After', String(retrySeconds));
    return next(
      new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many requests'),
    );
  }
  next();
};


module.exports = {
  emailIpBruteLimiter,
  slowerBruteLimiter,
  emailBruteLimiter,
  authLimiter,
};