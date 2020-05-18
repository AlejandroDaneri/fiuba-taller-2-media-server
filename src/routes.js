var express = require('express')
var router = express.Router()
var Firebase = require('./firebase')
var firebase = new Firebase()
var utils = require('./utils')

var queries = require('../db/queries')

router.use(express.json())

router.get('/list', function (req, res, next) {
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

router.get('/', function (req, res, next) {
  res.send('Hello World!')
})

router.get('/ping', function (req, res, next) {
  res.send('Ping received!')
  console.info('New ping from:', req.ip)
})

router.post('/videos', async function (req, res, next) {
  var aux = req.body
  aux.url = 'url'
  aux.thumb = 'thumb'
  // revisar que no toma las warning de las db aunque metas repetido
  queries
    .addVideo(aux)
    .then(function (videoID) {
      return queries.getSingleVideo(videoID) // check if new video is correctly inserted
    })
    .then(function (resp) {
      console.info('New video uploaded')
      res.status(201).json(resp)
    })
    .catch(function (error) {
      console.warn(error)
      res.status(400).json({ error: 'Payload is malformed' })
    })
})

router.get('/videos', function (req, res, next) {
  console.log('getting all videos')
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
      console.info('STATUS: postgres connected')
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
