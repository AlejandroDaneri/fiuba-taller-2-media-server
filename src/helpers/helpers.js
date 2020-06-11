var queries = require('../../db/queries')
var httpStatus = require('http-status-codes')
var errors = require('../errors/errors')
const logger = require('../config/logger')

function empty (input) {
  return input === undefined || input === ''
}

function isMalformed (iterable) {
  for (const field of iterable) {
    if (empty(field)) return true
  }
}

function validate (fields, res, next) {
  if (isMalformed(fields.values())) {
    logger.warn('Malformed payload')
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(errors.response(-1, 'Payload is malformed'))
  } else next()
}

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

  validateVideoPayload (req, res, next) {
    const payload = req.body
    validate(
      [
        payload.video_id,
        payload.name,
        payload.date_created,
        payload.type,
        payload.user_id,
        payload.size
      ],
      res,
      next
    )
  },

  validatePicturePayload (req, res, next) {
    const payload = req.body
    validate([payload.name, payload.user_id], res, next)
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
