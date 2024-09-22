const Blog = require('../model/blogModel');

const getBlog = async () => {
    const blogs = await Blog.find({});
    return blogs;
};
const createBlog = async (body) => {
    await Blog.create(body);  
};

module.exports = {
    getBlog,
    createBlog
}