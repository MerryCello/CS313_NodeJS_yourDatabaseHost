require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const ejs = require('ejs');
const myTools = require('./tools');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
const path = './.env'
//    if working locally, run this line of code:
fs.access(path, fs.F_OK, (err) => { if (!err) { process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; }});

const getTotalRows = async () => {
    let sqlGetSig = 'select id from SSAT.waiver_signatures;';
    let sqlGetRentals = 'select id from SSAT.bundle_rentals;';
    let sqlGetBundle = 'select id from SSAT.bundle;';
    let rows = {sig: 0, bun: 0, ren: 0};

    let promise = new Promise((res, rej) => {
        pool.query(sqlGetSig, (err, result) => {
            if(err) {
                console.log(err);
            } else {
                res(result.rows.length);
            }
        });
    }); 
    rows.sig = await promise;
    
    promise = new Promise((res, rej) => {
        pool.query(sqlGetBundle, (err, result) => {
            if(err) {
                console.log(err);
            } else {
                res(result.rows.length);
            }
        });
    }); 
    rows.bun = await promise;
    
    promise = new Promise((res, rej) => {
        pool.query(sqlGetRentals, (err, result) => {
            if(err) {
                console.log(err);
            } else {
                res(result.rows.length);
            }
        });
    }); 
    rows.ren = await promise;

    // console.log('rows: '+ JSON.stringify(rows));
    return rows;
};

const getSignatures = (req, res) => {
    let sql = "SELECT * FROM SSAT.waiver_signatures";
    let data = { results: false};

    pool.query(sql, function(err, result) {
        let page;
        //  If an error occurred...
        if (err) {
            console.log(err);
            page = myTools.errorPage;
        } else {
            rows = result.rows;
            // console.log("rows: \""+JSON.stringify(rows)+"\"");
            
            let html = fs.readFileSync(__dirname + '/views/pages/marketing.ejs', 'utf8');
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
    let sql = 'insert into SSAT.waiver_signatures (name, email) values ($1, $2);';

    pool.query(sql, [name, email], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            getSignatures(req, res);
        }
    });
}

const getBundles = (req, res) => {
    // TODO: build query...
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify('building in process...'));
}

module.exports = {
    getTotalRows: getTotalRows,
    getSignatures: getSignatures,
    removeSignature: removeSignature,
    addSignature: addSignature,
    getBundles: getBundles
};