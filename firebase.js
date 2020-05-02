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

  async listFiles() {
    // Lists files in the bucket
    console.log("Getting metadata of firebase files")
    const [files] = await this.storage.bucket(bucketName).getFiles();
    let response = {};
    for (const file of files) {
      let temp={};
      const [metadata] = await this.storage
          .bucket(bucketName)
          .file(file.name)
          .getMetadata();

      for(const [key, value] of Object.entries(metadata)){
        temp[key] =value;
      }

      const config = {
        action: 'read',
        expires:  Date.now() + 1000 * 60 * 60,
      };

      const [url] = await this.storage
          .bucket(bucketName)
          .file(file.name)
          .getSignedUrl(config);

      temp["URL"] =url

      response[file.name]=temp;
    }
    return response;
  }
}

module.exports = Firebase
