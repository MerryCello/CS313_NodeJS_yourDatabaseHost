const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const queries = require('./queries');
const myTools = require('./tools');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const router = express.Router();
const app = express();

// Bad practice to use global variable for session storage.
// This will have to do for now.
var sess;

app.set('port', process.env.PORT || 5000)
   .use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({extended: true}))
   .use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs');

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

// for login form to validate login information with the databse
router.post('/login', (req, res) => {
    sess = req.session;
    let username = req.body.username;
    /**
     * validate via the DB here
     * i.e.:
     * if(queries.isValidLogin(username, password)) {
     *    set session.username
     *    res.end('valid')
     * }
     */
    sess.username = username;
    res.end('valid');
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

// goes to dashboard if there is a valid session
// else goes to redirect for login
router.get('/dashboard', async (req, res) => {
    sess = req.session;
    if(sess.username) {
        // by default send to home page
        // let page = myTools.home.getHomePage();
        let rows = await queries.getTotalRows();
        // let rows = {bun: 0, ren: 0, sig: 0};
        let html = fs.readFileSync(__dirname + '/views/pages/home.ejs', 'utf8');
        let page = ejs.render(
            html,
            {
                name: sess.username,
                bundlesNum: rows.bun,
                rentalsNum: rows.ren,
                signNum: rows.sig
            }
        );
        data = {
            page: page,
            icon_url: "/media/db.jpg",
            tab1: "/dashboard/home",
            tab2: "/dashboard/bundles",
            tab3: "/dashboard/rentals",
            tab4: "/dashboard/marketing",
            logout: "/logout",
            about: "/about"
        }
        res.render('dashboard', data);
    } else {
        res.redirect('/');
    }
});

router.get('/dashboard/:tab', async (req, res) => {
    sess = req.session;
    if(sess.username) {
        let page;
        switch(req.params.tab) {
            case 'home':
                // page = myTools.home.getHomePage(sess.username);
                let rows = await queries.getTotalRows();
                // let rows = {bun: 0, ren: 0, sig: 0};
                let html = fs.readFileSync(__dirname + '/views/pages/home.ejs', 'utf8');
                page = ejs.render(
                    html,
                    {
                        name: sess.username,
                        bundlesNum: rows.bun,
                        rentalsNum: rows.ren,
                        signNum: rows.sig
                    }
                );
                break;
            case 'bundles':
                queries.getBundles(req, res);
                // page = fs.readFileSync(__dirname + '/views/pages/bundles.ejs', 'utf8');
                return;
            case 'rentals':
                page = fs.readFileSync(__dirname + '/views/pages/rentals.ejs', 'utf8');
                break;
            case 'marketing':
                queries.getSignatures(req, res);
                return;
            default:
                page = myTools.errorPage;
                break;
        }
        res.setHeader('Content-Type', 'text/html');
        res.send(page);
    } else {
        res.redirect('/');
    }
});

//    UI CSS files
router.get('/css/styles.css', (req, res) => {
    res.sendFile('styles.css', { root: __dirname + "/public/css" })
});

 //    UI JS files
 router.get('/js/inputValidation.js', (req, res) => {
    res.sendFile('inputValidation.js', { root: __dirname + "/public/js" })
 })

/**
 *      DB Queries
 */ 

//bundles
router.post('/q/addBundle', (req, res) => {
    sess = req.session;
    if(sess.username) {
        let body = req.body;
        if(body.name
           && body.description
           && body.price) {
            queries.addBundle(req, res);
        } else {
            queries.getBundles(req, res);
        }
    } else {
        res.redirect('/');
    }
});
router.post('/q/removeBundle', (req, res) => {
    sess = req.session;
    if(sess.username) {
        if(req.body.id) {
            queries.removeBundle(req, res);
        } else {
            queries.getBundles(req, res);
        }
    } else {
        res.redirect('/');
    }
});
router.post('/q/updateBundle', (req, res) => {
    sess = req.session;
    if(sess.username) {
        let body = req.body;
        if(    body.id
            && body.name
            && body.description
            && body.price) {
            queries.updateBundle(req, res);
        } else {
            queries.getBundles(req, res);
        }
    } else {
        res.redirect('/');
    }
});

// waiver
router.post('/q/removeSignature', (req, res) => {
    sess = req.session;
    if(sess.username) {
        if(req.body.id) {
            queries.removeSignature(req, res, req.body.id);
        } else {
            queries.getSignatures(req, res);
        }
    } else {
        res.redirect('/');
    }
});
router.post('/q/addSignature', (req, res) => {
    sess = req.session;
    if(sess.username) {
        // console.log('body:' + JSON.stringify(req.body));
        if(req.body.name && req.body.email) {
            queries.addSignature(req, res, req.body.name, req.body.email);
        } else {
            queries.getSignatures(req, res);
        }
    } else {
        res.redirect('/');
    }
});
router.get('/getBundles', (req, res) => {
    sess = req.session;
    if(sess.username) {
        queries.getBundles(req, res);
    } else {
        res.redirect('/');
    }
});

app.use('/', router);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port: ${app.get('port')}`);
});
