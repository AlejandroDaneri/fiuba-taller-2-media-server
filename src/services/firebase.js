var admin = require('firebase-admin')
const logger = require('../config/logger')
const constants = require('../constants/constants')

const bucketName = 'chotuve-grupo8.appspot.com'
const baseVideosUrl = 'uploads/videos/test/'
const baseAvatarsUrl = 'uploads/videos/test/'

const config = {
  action: 'read',
  expires: Date.now() + 1000 * 60 * 60 * 3000
}

class Firebase {
  constructor () {
    if (Firebase.instance) {
      return Firebase.instance
    }
    this.firebaseConfig = {
      apiKey: 'AIzaSyD2R77K2nWb_iJbCIzgTCsFZ36kxDF_zr0',
      authDomain: 'chotuve-grupo8.firebaseapp.com',
      databaseURL: 'https://chotuve-grupo8.firebaseio.com',
      projectId: 'chotuve-grupo8',
      storageBucket: 'chotuve-grupo8.appspot.com',
      messagingSenderId: '968905452769',
      appId: '1:968905452769:web:469139c9bccac35d301ba0',
      measurementId: 'G-QSJF5QG7WS'
    }
    this.fapp = admin.initializeApp(this.firebaseConfig)
    this.storage = this.fapp.storage()
    Firebase.instance = this
  }

  async getVideoLinks (filename) {
    const video = await this.storage
      .bucket(bucketName)
      .file(`${baseVideosUrl}${filename}`)
      .getSignedUrl(config)
      .catch(() =>
        logger.error(`Error creating link for gs://${bucketName}/${filename}`)
      )
    filename = filename.replace(constants.FILE_EXT_REGEXP, '')

    const img = await this.storage
      .bucket(bucketName)
      .file(
        `${baseVideosUrl}${constants.THUMB_PREFIX}${filename}${constants.THUMB_FILE_EXT}`
      )
      .getSignedUrl(config)
      .catch(() =>
        logger.error(
          `Error creating links for gs://${bucketName}/${filename}${constants.THUMB_FILE_EXT}`
        )
      )
    return [video[0], img[0]]
  }

  async getAvatarLink (filename) {
    const avatar = await this.storage
      .bucket(bucketName)
      .file(`${baseAvatarsUrl}${filename}`)
      .getSignedUrl(config)
      .catch(() =>
        logger.error(`Error creating link for gs://${bucketName}/${filename}`)
      )
    return avatar[0]
  }

  deleteVideo (filename) {
    // Deletes the file from the bucket
    return this.storage
      .bucket(bucketName)
      .file(`${baseVideosUrl}${filename}`)
      .delete()
      .then(() => {
        logger.log(`gs://${bucketName}/${baseVideosUrl}${filename} deleted.`)
      })
      .catch(() =>
        logger.error(
          `Error deleting gs://${bucketName}/${baseVideosUrl}${filename}`
        )
      )
  }

  deletePicture (filename) {
    // Deletes the file from the bucket
    return this.storage
      .bucket(bucketName)
      .file(`${baseAvatarsUrl}${filename}`)
      .delete()
      .then(() => {
        logger.log(`gs://${bucketName}/${baseAvatarsUrl}${filename} deleted.`)
      })
      .catch(() =>
        logger.error(
          `Error deleting gs://${bucketName}/${baseAvatarsUrl}${filename}`
        )
      )
  }
}

module.exports = Firebase
