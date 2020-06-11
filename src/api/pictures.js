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
  helper.validatePayload2,
  helper.checkDuplicate2,
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

// pictures.patch('/:id', helper.lookupVideo, function (req, res, next) {
//   //recibe el nombre
//   res.json(req.video)
// })
//
//
pictures.get('/:id', helper.lookupVideo2, function (req, res, next) {
  res.json(req.picture)
})
//
// pictures.delete('/:id', helper.lookupVideo, async function (req, res, next) {
//   const id = req.params.id
//   queries
//     .deleteVideo(id)
//     .then(({ name: filename }) => {
//       fb.deleteVideo(filename)
//       logger.log(`Successfully deleted video ${id}`)
//       res.status(httpStatus.OK).json(`Successfully deleted video ${id}`)
//     })
//     .catch(
//       /* istanbul ignore next */ err => {
//         req.error = errors.response(-1, 'Video cannot be deleted')
//         next(err)
//       }
//     )
// })

module.exports = pictures
