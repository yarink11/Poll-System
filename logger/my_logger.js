const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const config = require('config')

const logger = createLogger({
  level: config.logger.level,
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new transports.Console(),
    new transports.File({
        filename: config.logger.file_path })
    ]
})

module.exports = logger