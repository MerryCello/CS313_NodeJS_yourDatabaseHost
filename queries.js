require('dotenv').config();
const fs = require('fs')
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

const path = './.env'
fs.access(path, fs.F_OK, (err) => {
  if (err) {
    console.error(err);
    console.log("here");
    return
  }
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
})

const getSignatures = (req, res) => {
    let sql = "SELECT * FROM SSAT.waiver_signatures";
    let data = { results: "hello!"};

    pool.query(sql, function(err, result) {
    //  If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        } else {
            data = { results: result.rows };
            // console.log("Back from DB with result:");
            // console.log(result.rows);
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data.results));
    });
}

module.exports = { getSignatures: getSignatures };