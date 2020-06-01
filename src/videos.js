var express = require('express')
var videos = express.Router()

var httpStatus = require('http-status-codes')
var queries = require('../db/queries')
var helper = require('./helpers')

var Firebase = require('./firebase')
var fb = new Firebase()
videos.use(express.json())

videos.post('/', helper.validatePayload, helper.checkDuplicate, async function (
  req,
  res,
  next
) {
  var reqBody = req.body
  const [url, thumb] = await fb.getLinks(reqBody.name)
  reqBody.url = url
  reqBody.thumb = thumb
  queries
    .addVideo(reqBody)
    .then(() => {
      console.info('New video uploaded')
      res.status(httpStatus.CREATED).send(reqBody)
    })
    .catch(
      /* istanbul ignore next */ err => {
        req.error = 'Video cannot be added'
        next(err)
      }
    )
})

videos.get('/', function (req, res, next) {
  helper
    .getVideos(req.query.id)
    .then(([message, result]) => {
      console.info(message)
      res.status(httpStatus.OK).json({ videos: result })
    })
    .catch(
      /* istanbul ignore next */ err => {
        req.error = 'Video cannot be obtained'
        next(err)
      }
    )
})

videos.get('/:id', helper.lookupVideo, function (req, res, next) {
  res.json(req.video)
})

videos.delete('/:id', helper.lookupVideo, async function (req, res, next) {
  const id = req.params.id
  queries
    .deleteVideo(id)
    .then(({ name: filename }) => {
      fb.deleteVideo(filename)
      console.log(`Successfully deleted video ${id}`)
      res.status(httpStatus.OK).json(`Successfully deleted video ${id}`)
    })
    .catch(
      /* istanbul ignore next */ err => {
        req.error = 'Video cannot be deleted'
        next(err)
      }
    )
})

module.exports = videos
