const express = require('express');
var gameEngine = require('./gameEngine');
var app = express();

app.set('port', process.env.PORT|| 5000)
   .use(express.static(__dirname + '/public'))
   .set('views', __dirname + '/views')
   .set('view engine', 'ejs')
   .get('/', (req, res) => {
       res.sendFile('form.html', { root: __dirname + "/public" });
   })
   .get('/game', gameEngine.playGame)
   .listen(app.get('port'), function() {
       console.log('Listening on port: ' + app.get('port'));
   })
