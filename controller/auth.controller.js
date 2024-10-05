const { userService, tokenService, authService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status'); 

const register = catchAsync( async (req, res) => {
    const user = await userService.createUser(req.body);
    const token = await tokenService.generateAuthToken(user._id);
    res.status(httpStatus.CREATED).send({success: true, message: "user registration successful", user, token});
});

const login = catchAsync( async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const token = await tokenService.generateAuthToken(user._id);
    res.status(httpStatus.OK).send({user, token});
});

module.exports = { 
    register,
    login,
 };