require('dotenv').config()
var express = require('express')
var app = express()
var routes = require('./src/routes')

app.use('/', routes)

const server = app.listen(process.env.PORT, function () {
  console.info('Example app listening on port', process.env.PORT)
})

module.exports = server
