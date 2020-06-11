var express = require('express')
var router = express.Router()
var videos = require('./videos')
var pictures = require('./pictures')
const errors = require('../errors/errors')
const logger = require('../config/logger')

var utils = require('../helpers/utils')

router.use('/videos', videos)
router.use('/pictures', pictures)
router.use(express.json())

router.get('/', function (req, res, next) {
  res.send('Hello World!')
})

router.get('/ping', function (req, res, next) {
  res.send('Ping received!')
  logger.info(`GET /ping : New ping from ${req.ip}`)
})

router.get('/status', function (req, res) {
  utils
    .checkPostgres()
    .then(() => {
      logger.info('GET /status: postgres connected')
      res.json(
        errors.response(0, 'media-server', {
          server_status: 'online',
          database_status: 'online'
        })
      )
    })
    .catch(() => {
      logger.error('GET /status: postgres connection error')
      res.json(
        errors.response(0, 'media-server', {
          server_status: 'online',
          database_status: 'offline'
        })
      )
    })
})
module.exports = router
