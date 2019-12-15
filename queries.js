// npm native modules
require('dotenv').config();
const fs = require('fs');
// setup
const path = './.env';
    // if working locally, run this line of code:
fs.access(path, fs.F_OK, (err) => { if (!err) { process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; }});

module.exports = {
    overview:  require('./queries/overview'),
    bundles:   require('./queries/bundles'),
    rentals:   require('./queries/rentals'),
    marketing: require('./queries/marketing'),
    signup:    require('./queries/signup'),
    login:     require('./queries/login')
};