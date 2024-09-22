const express = require('express');
const blogRouter = require('./routes/blogRouter');
const authRouter = require('./routes/auth.route');
const { errorHandler, errorConverter } = require('./middlewares/error');
const { ApiError } = require('./utils/ApiError');
const httpStatus = require('http-status');
const morgan = require('./config/morgan');
//const bodyParser = require('body-parser');
const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(express.json());
app.use(blogRouter);
app.use(authRouter);
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});
app.use(errorConverter);
app.use(errorHandler);


module.exports = app;