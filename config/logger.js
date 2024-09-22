const winston = require('winston');
const config = require('./config');
const { format, createLogger, transports } = winston;
const { combine, timestamp, printf, colorize, uncolorize } = format;

const winstonFormat = printf(({level, message, timestamp, stack}) => {
    return `${timestamp}: ${level}: ${stack || message}`;
})

const logger = createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: combine(
        timestamp(),
        winstonFormat,
        config.env === 'development' ? colorize() : uncolorize()
    ),
    transports: [new transports.Console()],
});

module.exports = logger;