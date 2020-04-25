require('dotenv').config()
var express = require('express');
var app = express();
import Firebase from "./firebase"
let firebase = new Firebase()

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port',process.env.PORT);
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get("/download", function(req, res) {
    console.error("download")
    res.send("download")
    firebase.downloadFile()
})

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

//------------PG---------------
function postgres() {
    const { Client } = require('pg')
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        //ssl: true,
    })
    client
        .connect()
        .then(() => console.log('connected'))
        .catch(err => console.error('connection error', err.stack))
    // await client.connect()
    // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    // console.log(res.rows[0].message) // Hello world!
    // await client.end()
}
app.get('/pg', function (req, res) {
    postgres()
});

