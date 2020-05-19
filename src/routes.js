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
  console.info('GET /ping : New ping from', req.ip)
})

router.post('/videos', async function (req, res, next) {
  var aux = req.body
  const urls = await firebase.getLinks(aux.name)
  aux.url = urls[0]
  aux.thumb = urls[1]

  if (
    empty(aux.video_id) ||
    empty(aux.name) ||
    empty(aux.date_created) ||
    empty(aux.type) ||
    empty(aux.size)
  ) {
    console.warn('POST /videos: Malformed payload')
    return res.status(400).json({ error: 'Payload is malformed' })
  }

  var duplicated = false

  try {
    duplicated = !!(await queries
      .getSingleVideo(aux.video_id)
      .then(result => result.length > 0)
      .catch(err => console.error(err)))
    if (duplicated) {
      console.warn('POST /videos: canceled due duplicated video_id')
      return res.status(409).json({ error: 'Duplicated' })
    }
    await queries.addVideo(aux).catch(err => console.error(err))
    console.info('POST /videos: New video uploaded')
    res.status(201).send(aux)
  } catch (err) {
    console.warn(err)
    res.status(500).json('error')
  }
})

router.get('/videos', async function (req, res, next) {
  if (req.query.id) {
    await queries
      .getSingleVideo(req.query.id)
      .then(function (video) {
        console.info('GET /videos: Getting single video')
        res.status(200).json({ videos: video })
      })
      .catch(function (error) {
        console.error('Video cannot be obtained')
        next(error)
      })
  } else {
    await queries
      .getAll()
      .then(function (videos) {
        console.info('GET /videos: Getting all videos')
        res.status(200).json({ videos: videos })
      })
      .catch(function (error) {
        console.error('videos cannot be obtained')
        next(error)
      })
  }
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
