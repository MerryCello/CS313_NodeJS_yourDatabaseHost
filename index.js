const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
// const redis = require('redis');
const queries = require('./queries');
const router = express.Router();
const app = express();

// Bad practice to use global variable for session storage.
// This will have to do for now.
var sess;

app.set('port', process.env.PORT || 5000)
   .use(express.static(__dirname + '/public'))
   .use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({extended: true}))
   .set('views', __dirname + '/views')
   .set('view engine', 'ejs');

//    redirects to login if no valid session is in use
router.get('/', (req, res) => {
    sess = req.session;
    if(sess.username) {
        return res.redirect('/dashboard');
    }
    res.sendFile('login1.html', { root: __dirname + "/public" });
});

// for login form to validate login information with the databse
router.post('/login', (req, res) => {
    sess = req.session;
    /**
     * validate via the DB here
     * i.e.:
     * if(queries.isValidLogin(username, password)) {
     *    set session.username
     *    res.end('valid')
     * }
     */
    sess.username = req.body.username;
    res.end('valid');
});

// goes to dashboard if there is a valid session
// else goes to redirect for login
router.get('/dashboard', (req, res) => {
    sess = req.session;
    if(sess.username) {
        res.write(`<h1>Hello ${sess.username} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    } else {
        res.redirect('/');
    }
});

// url to logout. To be used as href
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.use('/', router);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port: ${app.get('port')}`)
});

// //    UI HTML/EJS pages
// app.get('/', redirect.getPage)// (req, res) => {
// //        res.sendFile('login.html', { root: __dirname + "/public" });
// //    })
// //    UI JS files
// app.get('/js/inputValidation.js', (req, res) => {
//        res.sendFile('inputValidation.js', { root: __dirname + "/public/js" })
//     })
// //    UI CSS files
// app.get('/css/styles.css', (req, res) => {
//         res.sendFile('styles.css', { root: __dirname + "/public/css" })
//     })
// //    JS queries
// app.get('/getSignatures', queries.getSignatures)
// app.get('/getBundles', queries.getBundles)
// //    Start listening
// app.listen(app.get('port'), function() {
//        console.log('Listening on port: ' + app.get('port'));
//    });
