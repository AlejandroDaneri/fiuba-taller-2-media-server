require('dotenv').config()
var express = require('express')
var cors = require('cors')
var app = express()
var routes = require('./src/routes')

app.use(function (req, res, next) {
  const today = new Date()
  const date =
    today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  const dateTime = date + 'T' + time
  console.debug(req.method, req.path, req.ip, dateTime)
  next()
})

function errorHandler (err, req, res, next) {
  console.error(err)
  res.status(500)
  res.json({ error: req.error })
}

app.use(express.json())
app.use(cors())
app.use('/', routes)
app.use(errorHandler)

const server = app.listen(process.env.PORT, function () {
  console.info('Example app listening on port', process.env.PORT)
})

module.exports = server
