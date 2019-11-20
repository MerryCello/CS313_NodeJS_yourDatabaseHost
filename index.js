const express = require('express');
const calcRates = require('./calcRates');
const queries = require('./queries');
var app = express();

app.set('port', process.env.PORT || 5000)
   .use(express.static(__dirname + '/public'))
   .set('views', __dirname + '/views')
   .set('view engine', 'ejs')
//    UI HTML pages
   .get('/', (req, res) => {
       res.sendFile('login.html', { root: __dirname + "/public" });
   })
//    UI JS files
   .get('/js/inputValidation.js', (req, res) => {
       res.sendFile('inputValidation.js', { root: __dirname + "/public/js" })
    })
//    UI CSS files
   .get('/css/styles.css', (req, res) => {
        res.sendFile('styles.css', { root: __dirname + "/public/css" })
    })
//    JS queries
   .get('/results', calcRates.calcRates)
   .get('/getSignatures', queries.getSignatures)
//    Start listening
   .listen(app.get('port'), function() {
       console.log('Listening on port: ' + app.get('port'));
   })
