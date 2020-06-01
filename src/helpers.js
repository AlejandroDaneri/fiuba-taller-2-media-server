var queries = require('../db/queries')
var httpStatus = require('http-status-codes')

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
        .json({ error: 'Payload is malformed' })
    } else next()
  },

  lookupVideo (req, res, next) {
    const videoID = req.params.id
    queries.getSingleVideo(videoID, function (result, err) {
      /* istanbul ignore if */
      if (err) {
        req.error = 'An error has occurred'
        next(err)
      } else if (result.length === 0) {
        res.statusCode = httpStatus.NOT_FOUND
        console.warn('Video', videoID, 'not found')
        return res.json({ error: 'Video not found' })
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
        req.error = 'An error has occurred'
        next(err)
      } else if (result.length > 0) {
        res.statusCode = httpStatus.CONFLICT
        console.warn('Video', videoID, 'already exists')
        return res.json({ error: 'Duplicated' })
      }
      next()
    })
  }
}
