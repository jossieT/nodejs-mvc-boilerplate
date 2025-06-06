const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { userValidation, authValidation } = require('./../validations');
const { authController } = require('../controller');
const { authLimiter } = require('./../middlewares/authLimiter');

/** POST Methods */
/**
 * @openapi
 * '/api/user/register':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - password
 *            properties:
 *              name:
 *                type: string
 *                default: johndoe
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: johnDoe20!@
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post(
  '/auth/register',
  validate(userValidation.createUserSchema),
  authController.register,
);

router.post(
  '/auth/login',
  authLimiter,
  validate(authValidation.loginSchema),
  authController.login,
);

router.post(
  '/auth/refresh-token',
  validate(authValidation.refreshTokenSchema),
  authController.refreshToken,
);

module.exports = router;
