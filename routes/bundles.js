const express = require('express');
const queries = require('../queries');
const router  = express.Router();

//bundles
router.get('/getBundles', (req, res) => {
    sess = req.session;
    if(sess.username) {
        queries.bundles.getBundles(req, res);
    } else {
        res.redirect('/');
    }
});
router.post('/q/addBundle', (req, res) => {
    sess = req.session;
    if(sess.username) {
        let body = req.body;
        if(body.name
           && body.description
           && body.price) {
            queries.bundles.addBundle(req, res);
        } else {
            queries.bundles.getBundles(req, res);
        }
    } else {
        res.redirect('/');
    }
});
router.post('/q/removeBundle', (req, res) => {
    sess = req.session;
    if(sess.username) {
        if(req.body.id) {
            queries.bundles.removeBundle(req, res);
        } else {
            queries.bundles.getBundles(req, res);
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
            queries.bundles.updateBundle(req, res);
        } else {
            queries.bundles.getBundles(req, res);
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;