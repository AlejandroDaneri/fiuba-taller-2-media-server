require('dotenv').config()
var express = require('express')
var cors = require('cors')
var app = express()
var routes = require('./src/api/routes')
const constants = require('./src/constants/constants')
const logger = require('./src/config/logger')

app.use(express.json())

app.use(function (req, res, next) {
  logger.debug(`${req.method} ${req.path}`)
  if (Object.keys(req.body).length !== 0) {
    console.table(req.body)
  }
  next()
})

function errorHandler (err, req, res, next) {
  var code = 500
  logger.error(err)
  logger.debug(err.stack)
  if (req.error_code) code = req.error_code
  res.status(code)
  res.json(req.error)
}

app.use(cors())
app.use(constants.PREFIX_URL + '/', routes)
app.use(errorHandler)

const server = app.listen(process.env.PORT, function () {
  logger.info(`App listening on port ${process.env.PORT}`)
})

module.exports = server
