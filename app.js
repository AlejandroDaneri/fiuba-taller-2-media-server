require('dotenv').config()
var express = require('express')
var cors = require('cors')
var app = express()
var routes = require('./src/api/routes')
const constants = require('./src/constants/constants')
const logger = require('./src/config/logger')

app.use(function (req, res, next) {
  logger.debug(`${req.method} ${req.path}`)
  next()
})

function errorHandler (err, req, res, next) {
  logger.error(err)
  logger.debug(err.stack)
  res.status(500)
  res.json(req.error)
}

app.use(express.json())
app.use(cors())
app.use(constants.PREFIX_URL + '/', routes)
app.use(errorHandler)

const server = app.listen(process.env.PORT, function () {
  logger.info(`App listening on port ${process.env.PORT}`)
})

module.exports = server
