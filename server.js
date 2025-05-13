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
const config = require('./config/config');

//const { xss } = require("express-xss-sanitizer");
const xssClean = require('xss-clean');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

//const bodyParser = require('body-parser');
const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(express.json());


//enabling cross origin
if (config.env === 'production') {
    app.use(cors({ origin: 'url' }));
    app.options('*', cors({ origin: 'url' }));
  } else {
    // enabling all cors
    app.use(cors());
    app.options('*', cors());
  }
// Initialize Swagger
swaggerDocs(app);
//Security
app.use(xssClean());
app.use(helmet.contentSecurityPolicy(config.cspOptions));
app.use(mongoSanitize());
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