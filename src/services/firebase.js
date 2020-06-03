var admin = require('firebase-admin')
const logger = require('../config/logger')

const bucketName = 'chotuve-grupo8.appspot.com'
const baseVideosUrl = 'uploads/videos/test/'
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

  async getLinks (filename) {
    const video = await this.storage
      .bucket(bucketName)
      .file(`${baseVideosUrl}${filename}.mp4`)
      .getSignedUrl(config)
      .catch(() =>
        logger.error(
          `Error creating link for gs://${bucketName}/${filename}.mp4`
        )
      )

    const img = await this.storage
      .bucket(bucketName)
      .file(`${baseVideosUrl}thumb_${filename}.jpg`)
      .getSignedUrl(config)
      .catch(() =>
        logger.error(
          `Error creating links for gs://${bucketName}/${filename}.jpg`
        )
      )

    return [video[0], img[0]]
  }

  deleteVideo (filename) {
    // Deletes the file from the bucket
    return this.storage
      .bucket(bucketName)
      .file(`${baseVideosUrl}${filename}.mp4`)
      .delete()
      .then(() => {
        logger.log(`gs://${bucketName}/${baseVideosUrl}${filename} deleted.`)
      })
      .catch(() =>
        logger.error(`Error deleting gs://${bucketName}/${filename}`)
      )
  }
}

module.exports = Firebase
