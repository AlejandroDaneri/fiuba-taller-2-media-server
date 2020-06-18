const errors = require('../errors/errors')
const httpStatus = require('http-status-codes')
const logger = require('../config/logger')

module.exports = {
  clientApiKeyValidation (req, res, next) {
    const clientApiKey = req.get('X-Client-ID')
    if (!clientApiKey) {
      logger.warn('Missing Api Key')
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(errors.response(-1, 'Missing Api Key'))
    } else if (clientApiKey !== process.env.API_KEY) {
      logger.warn('Invalid Api Key')
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(errors.response(-1, 'Invalid Api Key'))
    }
    next()
  }
}
