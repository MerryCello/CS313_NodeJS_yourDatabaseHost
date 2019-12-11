const express    = require('express');
const queries    = require('../queries');
const router = express.Router();

// for login by validating against databse
router.post('/login', async (req, res) => {
    sess = req.session;
    let username = req.body.username;
    let password = req.body.password;
    /**
     * validate against DB
     */
    if(await queries.login.isValidLogin(username, password)) {
        sess.username = username;
        res.end('valid');
    } else {
        res.end('invalid');
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

// add new user: validates username/creates new user
router.post('/addNewUser', async (req, res) => {
    let isUniqueUsername = (req.body.username) ? await queries.signup.isUniqueUsername(req.body.username) : false;
    let isUniqueEmail    = (req.body.email)    ? await queries.signup.isUniqueEmail(req.body.email)       : false;

    if(isUniqueUsername && isUniqueEmail && req.body.password) {
        // TODO: build addNewUser()
        queries.signup.addNewUser(req.body, res);
    } else if (isUniqueUsername || isUniqueEmail) {
        // console.log("here, here"); // TODO: fix this bug!!!
        res.send({isUnique: true});
        res.end();
    } else {
        res.send({isUnique: false});
        res.end();
    }
});

module.exports = router;