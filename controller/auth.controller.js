const { userService, tokenService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status'); 

const register = catchAsync( async (req, res) => {
    const user = await userService.createUser(req.body);
    const token = await tokenService.generateAuthToken(user._id);
    res.status(httpStatus.CREATED).send({success: true, message: "user registration successful", user, token});
});

module.exports = { register };