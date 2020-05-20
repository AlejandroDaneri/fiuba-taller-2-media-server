var express = require('express')
var router = express.Router()
var Firebase = require('./firebase')
var firebase = new Firebase()
var utils = require('./utils')

var queries = require('../db/queries')
var helper = require('./helpers')
var httpStatus = require('http-status-codes')

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
  console.info('GET /ping : New ping from', req.ip)
})

router.post('/videos', async function (req, res, next) {
  var reqBody = req.body
  const urls = await firebase.getLinks(reqBody.name)
  reqBody.url = urls[0]
  reqBody.thumb = urls[1]

  if (helper.isMalformed(reqBody)) {
    console.warn('POST /videos: Malformed payload')
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'Payload is malformed' })
  }

  try {
    if (await helper.checkDuplicate(reqBody.video_id)) {
      console.warn('POST /videos: canceled due duplicated video_id')
      return res.status(httpStatus.CONFLICT).json({ error: 'Duplicated' })
    }
    await queries.addVideo(reqBody).catch(err => console.error(err))
    console.info('POST /videos: New video uploaded')
    res.status(httpStatus.CREATED).send(reqBody)
  } catch (err) {
    console.error(err)
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json('error')
  }
})

router.get('/videos', async function (req, res, next) {
  await helper
    .getVideos(req.query.id)
    .then(function ([message, result]) {
      console.info(message)
      res.status(httpStatus.OK).json({ videos: result })
    })
    .catch(function (error) {
      console.error(error)
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Video cannot be obtained' })
    })
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
