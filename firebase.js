var admin = require('firebase-admin');


const bucketName = 'chotuve-grupo8.appspot.com';
const srcFilename = 'prueba.png';
const destFilename = './fiuba2.png';

class Firebase {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyD2R77K2nWb_iJbCIzgTCsFZ36kxDF_zr0",
            authDomain: "chotuve-grupo8.firebaseapp.com",
            databaseURL: "https://chotuve-grupo8.firebaseio.com",
            projectId: "chotuve-grupo8",
            storageBucket: "chotuve-grupo8.appspot.com",
            messagingSenderId: "968905452769",
            appId: "1:968905452769:web:469139c9bccac35d301ba0",
            measurementId: "G-QSJF5QG7WS"
        };
        this.fapp = admin.initializeApp(this.firebaseConfig);
        this.storage = this.fapp.storage();
    }

    downloadFile() {
        const options = {
            // The path to which the file should be downloaded, e.g. "./file.txt"
            destination: destFilename,
        };
    
        // Downloads the file
        this.storage
            .bucket(bucketName)
            .file(srcFilename)
            .download(options)
            .then(_ => {
                console.info("Download works")
            })
            .catch(_ => {
                console.info("Download dont works")
            })
    
    }
}

module.exports = Firebase
