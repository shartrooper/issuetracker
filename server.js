'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var expect = require('chai').expect;
var cors = require('cors');
const config = require('./utils/config');
const mongoose= require('mongoose');
var apiRoutes = require('./routes/api.js');
var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');
const helmet = require("helmet");

var app = express();

/** this project needs a db !! **/
console.log('connecting to DB URI');

const serverConnected = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('connected to mongo DataBase');
    } catch (error) {
        console.log('error connection to MongoDB:', error.message);
    }
};

serverConnected();
app.use(helmet());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({
        origin: '*'
    })); //For FCC testing purposes only


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
    }));

//Sample front-end
app.route('/:project/')
.get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
});

//Index page (static HTML)
app.route('/')
.get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
    res.status(404)
    .type('text')
    .send('Not Found');
});

// Error Handling middleware
app.use((err, req, res, next) => {
    let errCode,errMessage

    if (err.errors) {
        // mongoose validation error
        errCode = 400 // bad request
            const keys = Object.keys(err.errors)
            // report the first validation error
            errMessage = err.errors[keys[0]].message
    } else {
        // generic or custom error
        errCode = err.status || 500
            errMessage = err.message || 'Internal Server Error'
    }
    res.status(errCode).type('txt')
    .send(errMessage)
})



//Start our server and tests!
app.listen(config.PORT || 3000, function () {
    console.log("Listening on port " + config.PORT+", "+config.NODE_ENV+" mode");
    if (config.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
            try {
                runner.run();
            } catch (e) {
                var error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
        }, 3500);
    }
});

module.exports = app; //for testing
