const express    = require('express');
const session    = require('express-session');
const bodyParser = require('body-parser');
const path       = require('path');

// Routers
const bundlesRtr   = require('./routes/bundles');
const marketingRtr = require('./routes/marketing');
const rentalsRtr   = require('./routes/rentals');
const userRtr      = require('./routes/user');
const dashboardRtr = require('./routes/dashboard');
const router       = express.Router();
const app          = express();

// Bad practice to use global variable for session storage.
// This will have to do for now.
var sess;

// app setup
app.set('port', process.env.PORT || 5000)
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({extended: true}))
   .use(express.static(path.join(__dirname, 'public')));
// app router setup
app.use('/', router)
   .use('/', bundlesRtr)
   .use('/', marketingRtr)
   .use('/', rentalsRtr)
   .use('/', userRtr)
   .use('/', dashboardRtr);

//    MAIN PAGE
//    redirects to login if no valid session is in use
router.get('/', (req, res) => {
    sess = req.session;
    if(sess.username) {
        return res.redirect('/dashboard');
    }
    res.sendFile(__dirname + '/views/pages/login1.html');
});
router.get('/about', (req, res) => {
    res.sendFile('about.html', { root: __dirname + "/public" });
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port: ${app.get('port')}`);
});
