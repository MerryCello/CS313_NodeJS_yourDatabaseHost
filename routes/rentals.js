const express    = require('express');
const queries    = require('../queries');
const router = express.Router();

// rentals
router.get('/searchRentals', (req, res) => {
    sess = req.session;
    if(sess.username) {
        let query = req.query.query;
        let date = req.query.date;
        let isDate = true;
        if(date) {
            queries.rentals.search(res, date, isDate);
        } else {
            queries.rentals.search(res, query, !isDate);
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;