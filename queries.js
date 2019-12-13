// npm native modules
require('dotenv').config();
const fs = require('fs');
// setup
const path = './.env';
    // if working locally, run this line of code:
fs.access(path, fs.F_OK, (err) => { if (!err) { process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; }});

// my DB queries
const overview  = require('./queries/overview');
const bundles   = require('./queries/bundles');
const rentals   = require('./queries/rentals');
const marketing = require('./queries/marketing');
const signup    = require('./queries/signup');
const login     = require('./queries/login');

module.exports = {
    overview: overview,
    bundles: bundles,
    rentals: rentals,
    marketing: marketing,
    signup: signup,
    login: login
};