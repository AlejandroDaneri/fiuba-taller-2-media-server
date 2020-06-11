var queries = require('../../db/queries')
var httpStatus = require('http-status-codes')
var errors = require('../errors/errors')
const logger = require('../config/logger')

module.exports = {
  async getVideos (id) {
    var result
    var message
    if (id) {
      result = await queries.getSingleVideo(id)
      message = `Getting ${id} video`
    } else {
      result = await queries.getAll()
      message = 'Getting all videos'
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
      empty(payload.user_id) ||
      empty(payload.size)
    ) {
      logger.warn('Malformed payload')
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(errors.response(-1, 'Payload is malformed'))
    } else next()
  },

  validatePayload2 (req, res, next) {
    function empty (input) {
      return input === undefined || input === ''
    }
    const payload = req.body
    if (empty(payload.name) || empty(payload.user_id)) {
      logger.warn('Malformed payload')
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
        logger.warn(`Video ${videoID} not found`)
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
        logger.warn(`Video ${videoID} already exists`)
        res.statusCode = httpStatus.CONFLICT
        return res.json(errors.response(-1, `Video ${videoID} already exists`))
      }
      next()
    })
  },

  checkDuplicate2 (req, res, next) {
    const userID = req.body.user_id
    queries.getPicture(userID, function (result, err) {
      /* istanbul ignore if */
      if (err) {
        req.error = errors.response(-1, 'Unexpected error')
        next(err)
      } else if (result.length > 0) {
        logger.warn(`Picture of ${userID} already exists`)
        res.statusCode = httpStatus.CONFLICT
        return res.json(
          errors.response(-1, `Picture of ${userID} already exists`)
        )
      }
      next()
    })
  },

  lookupPicture (req, res, next) {
    const userID = req.params.id
    queries.getPicture(userID, function (result, err) {
      /* istanbul ignore if */
      if (err) {
        req.error = errors.response(-1, 'Unexpected error')
        next(err)
      } else if (result.length === 0) {
        logger.warn(`Picture of ${userID} not found`)
        res.statusCode = httpStatus.NOT_FOUND
        return res.json(errors.response(-1, `Picture of ${userID} not found`))
      }
      req.picture = result[0]
      next()
    })
  }
}
