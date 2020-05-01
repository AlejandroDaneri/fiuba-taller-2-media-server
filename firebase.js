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
    const [files] = await this.storage.bucket(bucketName).getFiles();

    console.log('Files:');
    for (const file of files) {
      console.log("-----------------")
      console.log("-----------------")
      console.log(file.name);
      const [metadata] = await this.storage
          .bucket(bucketName)
          .file(file.name)
          .getMetadata();

    console.log(`File: ${metadata.name}`);
    console.log(`Bucket: ${metadata.bucket}`);
    console.log(`Storage class: ${metadata.storageClass}`);
    console.log(`Self link: ${metadata.selfLink}`);
    console.log(`ID: ${metadata.id}`);
    console.log(`Size: ${metadata.size}`);
    console.log(`Updated: ${metadata.updated}`);
    console.log(`Generation: ${metadata.generation}`);
    console.log(`Metageneration: ${metadata.metageneration}`);
    console.log(`Etag: ${metadata.etag}`);
      const config = {
        action: 'read',
        expires:  Date.now() + 1000 * 60 * 60,
      };

      const [url] = await this.storage
          .bucket(bucketName)
          .file(file.name)
          .getSignedUrl(config);

      console.log(`The url for see ${file.name} is ${url}.`);

    }
  }

  downloadFile () {
    const srcFilename = 'prueba.png'
    const destFilename = './fiuba2.png'

    const options = {
      destination: destFilename
    }
    this.storage
      .bucket(bucketName)
      .file(srcFilename)
      .download(options)
      .then(_ => {
        console.info('Download works')
      })
      .catch(_ => {
        console.info('Download dont works')
      })
  }
}

module.exports = Firebase
