const errors = require('../errors/errors')
const httpStatus = require('http-status-codes')

module.exports = {
  clientApiKeyValidation (req, res, next) {
    const clientApiKey = req.get('X-Auth-Token')
    if (!clientApiKey) {
      req.error = errors.response(-1, 'Missing Api Key')
      req.error_code = httpStatus.UNAUTHORIZED
      next(new Error('Missing Api Key'))
    } else if (clientApiKey !== process.env.API_KEY) {
      req.error = errors.response(-1, 'Invalid Api Key')
      req.error_code = httpStatus.UNAUTHORIZED
      next(new Error('Invalid Api Key'))
    }
    next()
  }
}
