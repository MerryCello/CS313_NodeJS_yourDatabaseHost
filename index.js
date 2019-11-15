const express = require('express');
const calcRates = require('./calcRates');
var app = express();

app.set('port', process.env.PORT|| 5000)
   .use(express.static(__dirname + '/public'))
   .set('views', __dirname + '/views')
   .set('view engine', 'ejs')
   .get('/', (req, res) => {
       res.sendFile('form.html', { root: __dirname + "/public" });
   })
   .get('/results', calcRates.calcRates)
   .get('/js/inputValidation.js', (req, res) => {
       res.sendFile('inputValidation.js', { root: __dirname + "/public/js" })
   })
   .get('/css/styles.css', (req, res) => {
       res.sendFile('styles.css', { root: __dirname + "/public/css" })
   })
   .listen(app.get('port'), function() {
       console.log('Listening on port: ' + app.get('port'));
   })
