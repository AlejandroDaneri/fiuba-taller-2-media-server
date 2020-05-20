var express = require('express')
var router = express.Router()
var videos = require('./videos')

var Firebase = require('./firebase')
var fb = new Firebase()
var utils = require('./utils')
var httpStatus = require('http-status-codes')

router.use('/videos', videos)
router.use(express.json())

router.get('/list', function (req, res, next) {
  fb.listVideoFiles()
    .then(result => {
      res.json(result)
      console.info('Metadata request completed')
    })
    .catch(e => {
      console.error(`Could not get files metadata: ${e}`)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Error obtaining list')
    })
})

router.get('/', function (req, res, next) {
  res.send('Hello World!')
})

router.get('/ping', function (req, res, next) {
  res.send('Ping received!')
  console.info('GET /ping : New ping from', req.ip)
})

router.get('/status', function (req, res) {
  utils
    .checkPostgres()
    .then(() => {
      console.info('GET /status: postgres connected')
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
      console.error('GET /status: postgres connection error')
      console.error(err)
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
