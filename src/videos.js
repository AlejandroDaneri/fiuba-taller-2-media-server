import * as fb from './firebase'

var express = require('express')
var videos = express.Router()

var httpStatus = require('http-status-codes')
var queries = require('../db/queries')
var helper = require('./helpers')

videos.use(express.json())

videos.post('/', async function (req, res, next) {
  var reqBody = req.body
  const urls = await fb.getLinks(reqBody.name)
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

videos.get('/', async function (req, res, next) {
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

module.exports = videos
