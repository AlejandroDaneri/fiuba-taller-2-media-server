var queries = require('../db/queries')
var httpStatus = require('http-status-codes')
var errors = require('./errors')

module.exports = {
  async getVideos (id) {
    var result
    var message
    if (id) {
      result = await queries.getSingleVideo(id)
      message = 'GET /videos: Getting single video'
    } else {
      result = await queries.getAll()
      message = 'GET /videos: Getting all videos'
    }
    return [message, result]
  },

  validatePayload (req, res, next) {
    function empty (input) {
      return input === undefined || input === ''
    }
    const payload = req.body
    if (
      empty(payload.video_id) ||
      empty(payload.name) ||
      empty(payload.date_created) ||
      empty(payload.type) ||
      empty(payload.size)
    ) {
      console.warn('Malformed payload')
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(errors.response(-1, 'Payload is malformed'))
    } else next()
  },

  lookupVideo (req, res, next) {
    const videoID = req.params.id
    queries.getSingleVideo(videoID, function (result, err) {
      /* istanbul ignore if */
      if (err) {
        req.error = errors.response(-1, 'Unexpected error')
        next(err)
      } else if (result.length === 0) {
        console.warn(`Video ${videoID} already not found`)
        res.statusCode = httpStatus.NOT_FOUND
        return res.json(errors.response(-1, `Video ${videoID} not found`))
      }
      req.video = result[0]
      next()
    })
  },

  checkDuplicate (req, res, next) {
    const videoID = req.body.video_id
    queries.getSingleVideo(videoID, function (result, err) {
      /* istanbul ignore if */
      if (err) {
        req.error = errors.response(-1, 'Unexpected error')
        next(err)
      } else if (result.length > 0) {
        console.warn(`Video ${videoID} already exists`)
        res.statusCode = httpStatus.CONFLICT
        return res.json(errors.response(-1, `Video ${videoID} already exists`))
      }
      next()
    })
  }
}
