var express = require('express')
var router = express.Router()
var videos = require('./videos')

var utils = require('./utils')

router.use('/videos', videos)
router.use(express.json())

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
    .catch(() => {
      console.error('GET /status: postgres connection error')
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
