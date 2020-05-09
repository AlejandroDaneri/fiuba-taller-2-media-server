require('dotenv').config()
var express = require('express')
var app = express()
var routes = require('./src/routes')

app.use('/', routes)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.DOMAIN_ALLOWED)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

const server = app.listen(process.env.PORT, function () {
  console.info('Example app listening on port', process.env.PORT)
})

module.exports = server
