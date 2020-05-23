var admin = require('firebase-admin')

const bucketName = 'chotuve-grupo8.appspot.com'
const baseVideosUrl = 'uploads/videos/test/'
const config = {
  action: 'read',
  expires: Date.now() + 10000 * 60 * 60
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

  async getLinks (fileName) {
    const video = await this.storage
      .bucket(bucketName)
      .file(`${baseVideosUrl}${fileName}.mp4`)
      .getSignedUrl(config)

    const img = await this.storage
      .bucket(bucketName)
      .file(`${baseVideosUrl}thumb_${fileName}.jpg`)
      .getSignedUrl(config)

    return [video[0], img[0]]
  }
}

module.exports = Firebase
