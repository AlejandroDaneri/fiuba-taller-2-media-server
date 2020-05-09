var admin = require('firebase-admin')

const bucketName = 'chotuve-grupo8.appspot.com'

class Firebase {
  constructor () {
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
  }

  async listVideoFiles () {
    // Lists files in the bucket
    console.info('Getting metadata of firebase files')
    const [files] = await this.storage.bucket(bucketName).getFiles()
    var videos = {}

    for (const file of files) {
      var fileName = file.name
        .split('/')
        [file.name.split('/').length - 1].slice(0, -4)
      const metadataPromise = file.getMetadata()
      const urlPromise = file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60
      })
      const [metadata, url] = await Promise.all([metadataPromise, urlPromise])

      if (metadata[0].contentType === 'video/mp4') {
        videos[fileName] = {}
        videos[fileName].id = metadata[0].id
        videos[fileName].name = metadata[0].name
        videos[fileName].dateCreated = metadata[0].timeCreated
        videos[fileName].type = metadata[0].contentType
        videos[fileName].url = url[0]
      }
      if (metadata[0].contentType === 'image/jpeg') {
        fileName = fileName.slice(6) // deletes thumb_ prefix
        videos[fileName].thumb = url[0]
      }
    }
    return videos
  }
}

module.exports = Firebase
