var queries = require('../../db/queries')
var httpStatus = require('http-status-codes')
var errors = require('../errors/errors')
const logger = require('../config/logger')

function baseLookup (id, func, msg, req, res, next) {
  func(id, function (result, err) {
    /* istanbul ignore if */
    if (err) {
      req.error = errors.response(-1, 'Unexpected error')
      next(err)
    } else if (result.length === 0) {
      logger.warn(`${msg} not found`)
      res.statusCode = httpStatus.NOT_FOUND
      return res.json(errors.response(-1, `${msg} not found`))
    }
    req.result = result[0]
    next()
  })
}

function baseCheckDuplicates (id, func, msg, req, res, next) {
  func(id, function (result, err) {
    /* istanbul ignore if */
    if (err) {
      req.error = errors.response(-1, 'Unexpected error')
      next(err)
    } else if (result.length > 0) {
      logger.warn(`${msg} already exists`)
      res.statusCode = httpStatus.CONFLICT
      return res.json(errors.response(-1, `${msg} already exists`))
    }
    next()
  })
}

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
    baseLookup(
      videoID,
      queries.getSingleVideo,
      `Video ${videoID}`,
      req,
      res,
      next
    )
  },

  lookupPicture (req, res, next) {
    const userID = req.params.id
    baseLookup(
      userID,
      queries.getPicture,
      `Picture of ${userID}`,
      req,
      res,
      next
    )
  },

  checkVideoDuplicate (req, res, next) {
    const videoID = req.body.video_id
    baseCheckDuplicates(
      videoID,
      queries.getSingleVideo,
      `Video ${videoID}`,
      req,
      res,
      next
    )
  },

  checkPictureDuplicate (req, res, next) {
    const userID = req.body.user_id
    baseCheckDuplicates(
      userID,
      queries.getPicture,
      `Picture of ${userID}`,
      req,
      res,
      next
    )
  }
}
