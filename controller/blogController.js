const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const httpStatus = require('http-status');

const getBlog = catchAsync(async (req, res) => {
    const blogs = await blogService.getBlog({});
    res.status(httpStatus.OK).json(blogs);

});
const createBlog = catchAsync(async (req, res) => {
    const data = await blogService.createBlog(req.body);
    res.status(httpStatus.CREATED).send({ success: true, message: 'Blog created successfully', data });

});

module.exports = {
    getBlog,
    createBlog
}