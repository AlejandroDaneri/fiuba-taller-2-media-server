var admin = require('firebase-admin');

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
        console.info("Download a File")
        const options = {
            destination: destFilename,
        };
        
        const bucketName = 'chotuve-grupo8.appspot.com';
        const srcFilename = 'prueba.png';
        const destFilename = './fiuba2.png';
        
        this.storage
            .bucket(bucketName)
            .file(srcFilename)
            .download(options)
            .then(_ => {
                console.error("Download Works")
            })
            .catch(_ => {
                console.error("Download Error")
            })
    }
}

export default Firebase
