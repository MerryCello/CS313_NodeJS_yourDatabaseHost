require('dotenv').config();
const fs = require('fs')
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
const path = './.env'
//    if working locally, run this line of code:
fs.access(path, fs.F_OK, (err) => { if (!err) { process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; }})

const getSignatures = (req, res) => {
    let sql = "SELECT * FROM SSAT.waiver_signatures";
    let data = { results: "hello!"};

    pool.query(sql, function(err, result) {
    //  If an error occurred...
        if (err) { console.log(err); }
        else { data = { results: result.rows }; }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data.results));
    });
}

const getBundles = (req, res) => {
    // TODO: build query...
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify('building in process...'));
}

module.exports = { getSignatures: getSignatures, getBundles: getBundles };