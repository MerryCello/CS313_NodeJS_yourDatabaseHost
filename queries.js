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

const getBundles = (req, res) => {
    let sql = "SELECT * FROM SSAT.bundle as b order by b.price;";

    pool.query(sql, (err, result) => {
        let page;

        if (err) {
            console.log(err);
            page = myTools.errorPage;
        } else {
            rows = result.rows;
            // console.log("rows: \""+JSON.stringify(rows)+"\"");
            
            let html = fs.readFileSync(__dirname + '/views/pages/bundles.ejs', 'utf8');
            let tr;
            tr = myTools.bundles.buildBundleTableRows(rows);
            try {
                page = ejs.render(
                    html,
                    {
                        rows: tr,
                        rowsNum: rows.length
                    }
                );
            } catch(e) {
                console.log('Cannot render page: '+e.message);
            }
        }
        res.setHeader('Content-Type', 'text/html');
        res.send(page);
    });
}

const addBundle = (req, res) => {
    let sql = "insert into SSAT.bundle (name, description, price, img_url) values ($1, $2, $3, $4);";
    let data = [req.body.name, req.body.description, req.body.price, req.body.img_url];
    pool.query(sql, data, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            getBundles(req, res);
        }
    });
};

const removeBundle = (req, res) => {
    let sql = 'delete from SSAT.bundle where id=$1;';

    pool.query(sql, [req.body.id], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            getBundles(req, res);
        }
    });
}

const updateBundle = (req, res) => {
    let sql = 'update SSAT.bundle set name=$2, description=$3, price=$4, img_url=$5 where id=$1 returning *;';
    let data = [req.body.id, req.body.name, req.body.description, req.body.price, req.body.img_url];
    
    pool.query(sql, data, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.json(result.rows[0]);
            // console.log('result: ' + JSON.stringify(row));
            // getBundles(req, res);
        }
    });
}

module.exports = {
    getTotalRows: getTotalRows,
    getSignatures: getSignatures,
    removeSignature: removeSignature,
    addSignature: addSignature,
    getBundles: getBundles,
    addBundle: addBundle,
    removeBundle: removeBundle,
    updateBundle: updateBundle
};