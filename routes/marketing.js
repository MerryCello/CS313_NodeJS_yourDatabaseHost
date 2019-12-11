const express    = require('express');
const queries    = require('../queries');
const router = express.Router();

// waiver
router.post('/q/removeSignature', (req, res) => {
    sess = req.session;
    if(sess.username) {
        if(req.body.id) {
            queries.marketing.removeSignature(req, res, req.body.id);
        } else {
            queries.marketing.getSignatures(req, res);
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
            queries.marketing.addSignature(req, res, req.body.name, req.body.email);
        } else {
            queries.marketing.getSignatures(req, res);
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;