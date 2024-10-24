const express = require('express');
const blogRouter = require('./routes/blog.router');
const authRouter = require('./routes/auth.route');
const { errorHandler, errorConverter } = require('./middlewares/error');
const { ApiError } = require('./utils/ApiError');
const httpStatus = require('http-status');
const morgan = require('./config/morgan');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const { swaggerDocs } = require('./swagger');
//const { xss } = require("express-xss-sanitizer");
const xssClean = require('xss-clean');
const helmet = require('helmet');

//const bodyParser = require('body-parser');
const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(express.json());

// Initialize Swagger
swaggerDocs(app);
//Security
app.use(xssClean());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "'fonts.gstatic.com'"],
    },
    reportOnly: true,
}))

//routes
app.use(blogRouter);
app.use(authRouter);
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(errorConverter);
app.use(errorHandler);


module.exports = app;