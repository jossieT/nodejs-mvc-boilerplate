const  Blog  = require('../model/blogModel');

const getBlog = async (userId) => {
    const blogs = await Blog.find({createdBy:userId});
    return blogs;
};
const createBlog = async (body, userId) => {
    console.log("userId:", userId);
    const newBlog = await Blog.create({ ...body, createdBy: userId });
    return newBlog;
};


module.exports = {
    getBlog,
    createBlog
}