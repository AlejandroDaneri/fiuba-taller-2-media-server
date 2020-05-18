var express = require('express')
var router = express.Router()
var Firebase = require('./firebase')
var firebase = new Firebase()
var utils = require('./utils')

var queries = require('../db/queries')

router.use(express.json())

const empty = input => {
  if (input === undefined || input === '') {
    return true
  }
}

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

  if (
    empty(aux.video_id) ||
    empty(aux.name) ||
    empty(aux.date_created) ||
    empty(aux.type) ||
    empty(aux.size)
  ) {
    console.warn('Malformed payload in post /videos')
    return res.status(400).json({ error: 'Payload is malformed' })
  }

  var duplicated = false

  try {
    duplicated = !!(await queries
      .getSingleVideo(aux.video_id)
      .catch(err => console.error(err)))
    if (duplicated) {
      return res.status(409).json({ error: 'Duplicated' })
    }
    var id = await queries.addVideo(aux).catch(err => console.error(err))
    console.info('New video uploaded')
    res.status(201).json(id)
  } catch (err) {
    console.warn(err)
    res.status(500).json('error')
  }
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
