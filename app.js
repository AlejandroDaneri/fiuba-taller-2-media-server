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
