require('dotenv').config()
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port',process.env.PORT);
});

app.get('/ping', function (req, res) {
    res.send('Ping received!');
    console.log('New ping from:',req.ip);
});

// TESTING OTHER SERVERS ENDPOINTS
app.get('/auth', function (req, res) {
    var request = require('request');
    request(process.env.AUTH_BASE_URL, function (error, response, body) {
        if (!error && response.statusCode === process.env.OK_CODE) {
            console.log('Successfully pinged Auth Server') // Print the google web page.
            res.send(body)
        }
    })
});


const firebaseConfig = {
    apiKey: "AIzaSyD2R77K2nWb_iJbCIzgTCsFZ36kxDF_zr0",
    authDomain: "chotuve-grupo8.firebaseapp.com",
    databaseURL: "https://chotuve-grupo8.firebaseio.com",
    projectId: "chotuve-grupo8",
    storageBucket: "chotuve-grupo8.appspot.com",
    messagingSenderId: "968905452769",
    appId: "1:968905452769:web:469139c9bccac35d301ba0",
    measurementId: "G-QSJF5QG7WS"
};

var admin = require('firebase-admin');
var fapp = admin.initializeApp(firebaseConfig);

var storage = fapp.storage();

const bucketName = 'chotuve-grupo8.appspot.com';
const srcFilename = 'prueba.png';
const destFilename = '/home/ale/Documentos/fiuba2.png';

function downloadFile() {
    const options = {
        // The path to which the file should be downloaded, e.g. "./file.txt"
        destination: destFilename,
    };

    // Downloads the file
    storage
        .bucket(bucketName)
        .file(srcFilename)
        .download(options);

    console.log(
        `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
    );
}

downloadFile();