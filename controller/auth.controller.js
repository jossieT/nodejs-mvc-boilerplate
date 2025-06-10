//const { userService, tokenService, authService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { Token } = require('../model/token.model');
const { tokenTypes } = require('../config/tokens');
const config = require('../config/config');
const TokenService = require('jose-token-service');

const tokenService = new TokenService(Token, tokenTypes, config);
const { userService, authService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const token = await tokenService.generateAuthTokens(user.id);
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'user registration successful',
    user,
    token,
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const ipAddr =
    req.connection.remoteAddress === '::1'
      ? '127.0.0.1'
      : req.connection.remoteAddress;
  //const ipAddr = req.ip || req.connection.remoteAddress;
  const user = await authService.login(email, password, ipAddr);
  req.user = user;
  const token = await tokenService.generateAuthTokens(user.id);
  res.status(httpStatus.OK).send({ user, token });
});

const refreshToken = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuthToken(req.body.refreshToken);
  res.status(httpStatus.OK).send({ ...tokens });
});

module.exports = {
  register,
  login,
  refreshToken,
};
