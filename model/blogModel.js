const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    ref: 'User',
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
