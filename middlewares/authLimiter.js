const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const { ApiError } = require('./../utils/ApiError');
const httpStatus = require('http-status');

const maxAttemptByIpUsername = 100;
const maxAttemptsPerDay = 10;
const maxAttemptsPerEmail = 50;

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


const authLimiter = async (req, res, next) => {
  const ipAddr = req.connection.remoteAddress;
  const emailIpKey = `${req.body.email}_${ipAddr}`;
  const [slowerBruteRes, emailIpRes, emialBruteRes] = await Promise.all([
    slowerBruteLimiter.get(ipAddr),
    emailIpBruteLimiter.get(emailIpKey),
    emailBruteLimiter.get(req.body.email)
  ]);

  console.log('slowerBruteRes:', slowerBruteRes);
  console.log('emailIpRes:', emailIpRes);
  console.log('emailIpRes:', emialBruteRes);

  let retrySeconds = 0;
  if (
    slowerBruteRes &&
    slowerBruteRes.consumedPoints >= maxAttemptsPerDay
  ) {
    retrySeconds = Math.floor(slowerBruteRes.msBeforeNext / 1000) || 1;
  } else if (
    emailIpRes &&
    emailIpRes.consumedPoints >= maxAttemptByIpUsername
  ) {
    retrySeconds = Math.floor(emailIpRes.msBeforeNext / 1000) || 1;
  } else if (emialBruteRes &&
    emialBruteRes.consumedPoints >= maxAttemptsPerEmail) {
    retrySeconds = Math.floor(emialBruteRes.msBeforeNext / 1000) || 1;
  }
  console.log(retrySeconds);

  if (retrySeconds > 0) {

    res.set('Retry-After', String(retrySeconds));
    return next(
      new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many requests'),
    );
  }
  next();
  //} catch (rateLimiterError) {
  //     console.error('Too many requests || rate limiter error:', rateLimiterError);
  //     return next(new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Rate limiter error'));
  //   }
};

module.exports = {
  emailIpBruteLimiter,
  slowerBruteLimiter,
  authLimiter,
};