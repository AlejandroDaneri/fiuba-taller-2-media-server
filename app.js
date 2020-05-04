require('dotenv').config()
var express = require('express')
var app = express()
var Firebase = require('./firebase')
var firebase = new Firebase()

app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Origin',
    'https://fiuba-taller-2-web-admin.herokuapp.com'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.get('/list', function (req, res) {
  firebase
    .listVideoFiles()
    .then(result => {
      res.json(result)
      console.info('Metadata request completed')
    })
    .catch(e => console.error(`Could not get files metadata: ${e}`))
})

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(process.env.PORT, function () {
  console.info('Example app listening on port', process.env.PORT)
})

app.get('/ping', function (req, res) {
  res.send('Ping received!')
  console.info('New ping from:', req.ip)
})

// TESTING OTHER SERVERS ENDPOINTS
app.get('/auth', function (req, res) {
  var request = require('request')
  request(process.env.AUTH_BASE_URL, function (error, response, body) {
    if (!error && response.statusCode === process.env.OK_CODE) {
      console.info('Successfully pinged Auth Server')
      res.send(body)
    }
  })
})
