const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const httpStatus = require('http-status');

const getBlog = catchAsync(async (req, res) => {
  const blogs = await blogService.getBlog(req.user.id);
  res.status(httpStatus.OK).json(blogs);
});
const createBlog = catchAsync(async (req, res) => {
  console.log('req.user.id:', req.user.id);
  const data = await blogService.createBlog(req.body, req.user.id);
  res
    .status(httpStatus.CREATED)
    .send({ success: true, message: 'Blog created successfully', data });
});

module.exports = {
  getBlog,
  createBlog,
};
