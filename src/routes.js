var express = require('express')
var router = express.Router()
var Firebase = require('./firebase')
var firebase = new Firebase()
var tools = require('./utils')

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.DOMAIN_ALLOWED)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

router.get('/list', function (req, res) {
  firebase
    .listVideoFiles()
    .then(result => {
      res.json(result)
      console.info('Metadata request completed')
    })
    .catch(e => console.error(`Could not get files metadata: ${e}`))
})

router.get('/', function (req, res) {
  res.send('Hello World!')
})

router.get('/ping', function (req, res) {
  res.send('Ping received!')
  console.info('New ping from:', req.ip)
})

router.get('/status', function (req, res) {
  tools
    .check_postgres()
    .then(() => {
      console.log('STATUS: postgres connected')
      res.json({
        code: 0,
        message: 'media-server',
        'data:': {
          server_status: 'online',
          database_status: 'online'
        }
      })
    })
    .catch(err => {
      console.error('STATUS: postgres connection error', err.stack)
      res.json({
        code: 0,
        message: 'media-server',
        'data:': {
          server_status: 'online',
          database_status: 'offline'
        }
      })
    })
})

module.exports = router
