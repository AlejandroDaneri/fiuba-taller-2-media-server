var express = require('express')
var router = express.Router()
var Firebase = require('./firebase')
var firebase = new Firebase()
var utils = require('./utils')

var queries = require('../db/queries')

router.use(express.json())

router.get('/list', function (req, res) {
  firebase
    .listVideoFiles()
    .then(result => {
      res.json(result)
      console.info('Metadata request completed')
    })
    .catch(e => {
      console.error(`Could not get files metadata: ${e}`)
      res.status(400).send('Error obtaining list')
    })
})

router.get('/', function (req, res) {
  res.send('Hello World!')
})

router.get('/ping', function (req, res) {
  res.send('Ping received!')
  console.info('New ping from:', req.ip)
})

router.post('/videos', async function (req, res, next) {
  var aux = req.body
  aux.url = 'url'
  aux.thumb = 'thumb'
  queries
    .addVideo(aux)
    .then(function (videoID) {
      return queries.getSingleVideo(videoID) // check if new video is correctly inserted
    })
    .then(function (resp) {
      res.status(201).json(resp)
    })
    .catch(function (error) {
      next(error)
    })

  res.status(201).send(aux)
  console.info('New video uploaded')
})

router.get('/videos', function (req, res, next) {
  queries
    .getAll()
    .then(function (videos) {
      res.status(200).json(videos)
    })
    .catch(function (error) {
      console.error('videos cannot be obtained')
      next(error)
    })
})

router.get('/status', function (req, res) {
  utils
    .checkPostgres()
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
      console.error('STATUS: postgres connection error')
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
