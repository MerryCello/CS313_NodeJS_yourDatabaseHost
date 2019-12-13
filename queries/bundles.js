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
 * BUNDLES
 */
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
            
            let html = fs.readFileSync(__dirname + '/../views/pages/bundles.ejs', 'utf8');
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
};

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
};

module.exports = {
    getBundles: getBundles,
    addBundle: addBundle,
    removeBundle: removeBundle,
    updateBundle: updateBundle
};