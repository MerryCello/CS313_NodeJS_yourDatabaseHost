// npm native modules
const { Pool } = require('pg');
// setup
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

/**
 * OVERVIEW
 */
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

    return rows;
};

module.exports = {
    getTotalRows: getTotalRows,
};