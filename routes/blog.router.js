const express = require('express');
const { blogController } = require('../controller');
const { blogValidation } = require('../validations');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const router = express.Router();

/**
 * @openapi
 * '/blog':
 *  post:
 *     tags:
 *     - Blog
 *     summary: Create a new blog post
 *     description: Endpoint to create a new blog post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post
 *               description:
 *                 type: string
 *                 description: The description of the blog post
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 *  get:
 *     tags:
 *     - Blog
 *     summary: Get all blog posts
 *     description: Retrieve a list of all blog posts
 *     responses:
 *       200:
 *         description: Successful response with list of blog posts
 *       500:
 *         description: Server error
 */

router.post(
  '/blog',
  auth,
  validate(blogValidation.createBlogSchema),
  blogController.createBlog,
);

router.get('/blog', auth, blogController.getBlog);

module.exports = router;
