var express = require('express')
var pictures = express.Router()

var httpStatus = require('http-status-codes')
var queries = require('../../db/queries')
var helper = require('../helpers/helpers')
var errors = require('../errors/errors')
const logger = require('../config/logger')

var Firebase = require('../services/firebase')
var fb = new Firebase()
pictures.use(express.json())

pictures.post(
  '/',
  helper.validatePicturePayload,
  helper.checkPictureDuplicate,
  async function (req, res, next) {
    var reqBody = req.body
    reqBody.url = await fb.getAvatarLink(reqBody.name)
    queries
      .addPicture(reqBody)
      .then(() => {
        logger.info(`New picture uploaded - USER:${reqBody.user_id}`)
        res.status(httpStatus.CREATED).send(reqBody)
      })
      .catch(
        /* istanbul ignore next */ err => {
          req.error = errors.response(-1, 'Picture cannot be added')
          next(err)
        }
      )
  }
)

pictures.patch(
  '/:id',
  helper.validatePicturePayload,
  helper.lookupPicture,
  function (req, res, next) {
    const id = req.params.id
    const name = req.body.name
    fb.getAvatarLink(name)
      .then(url => {
        queries.updatePicture(id, name, url).then(() => {
          logger.log(`Successfully update picture of ${id}`)
          req.body.url = url
          res.status(httpStatus.OK).json(req.body)
        })
      })
      .catch(
        /* istanbul ignore next */ err => {
          req.error = errors.response(-1, 'Picture cannot be updated')
          next(err)
        }
      )
  }
)

pictures.get('/:id', helper.lookupPicture, function (req, res, next) {
  res.json(req.result)
})

pictures.delete('/:id', helper.lookupPicture, async function (req, res, next) {
  const id = req.params.id
  queries
    .deletePicture(id)
    .then(({ name: filename }) => {
      fb.deletePicture(filename)
      logger.log(`Successfully deleted picture of ${id}`)
      res.status(httpStatus.OK).json(`Successfully deleted picture of ${id}`)
    })
    .catch(
      /* istanbul ignore next */ err => {
        req.error = errors.response(-1, 'Picture cannot be deleted')
        next(err)
      }
    )
})

module.exports = pictures
