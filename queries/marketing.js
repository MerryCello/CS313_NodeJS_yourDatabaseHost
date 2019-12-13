// npm native modules
const { Pool } = require('pg');
const fs = require('fs');
const ejs = require('ejs');
// my modules modules
const myTools = require('../tools');
// setup
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

/**
 * MARKETING
 */
const getSignatures = (req, res) => {
    let sql = "SELECT * FROM SSAT.waiver_signatures as s order by s.name;";

    pool.query(sql, function(err, result) {
        let page;
        //  If an error occurred...
        if (err) {
            console.log(err);
            page = myTools.errorPage;
        } else {
            rows = result.rows;
            // console.log("rows: \""+JSON.stringify(rows)+"\"");
            
            let html = fs.readFileSync(__dirname + '/../views/pages/marketing.ejs', 'utf8');
            let tr = myTools.marketing.buildTableRows(rows);
            page = ejs.render(html, {emails: myTools.marketing.getEmails(rows, "email;"), rows: tr, rowsNum: rows.length});
            
        }
        res.setHeader('Content-Type', 'text/html');
        res.send(page);
    });
}

const removeSignature = (req, res, id) => {
    let sql = 'delete from SSAT.waiver_signatures where id=$1;';

    pool.query(sql, [id], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            getSignatures(req, res);
        }
    });
}

const addSignature = (req, res, name, email) => {
    let sql = "insert into SSAT.waiver_signatures (name, email) "+
              "select lower($1), lower($2) where not exists ("+
              "select name, email from SSAT.waiver_signatures "+
              "where lower(name)=lower($1) and lower(email)=lower($2));";

    pool.query(sql, [name, email], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            getSignatures(req, res);
        }
    });
}

module.exports = {
    getSignatures: getSignatures,
    removeSignature: removeSignature,
    addSignature: addSignature
};