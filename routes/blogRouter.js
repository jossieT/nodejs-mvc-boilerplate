const express = require('express');
const { blogController } = require('../controller');
const { blogValidation } = require('./../validations');
const validate = require('../middlewares/validate');
const router = express.Router();

router.post('/blog', validate(blogValidation.createBlogSchema), blogController.createBlog);
router.get('/blog', blogController.getBlog);

module.exports = router;