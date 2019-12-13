// npm native modules
const { Pool } = require('pg');
// my modules modules
const myTools = require('../tools');
// setup
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

/**
 * RENTALS
 */
const search = (res, query, isDate) => {
    let sql = "select r.id, b.name as bundle_name, r.day as taken_date, u.name as user_name, u.email as user_email from SSAT.bundle_rentals as r join SSAT.waiver_signatures as u on r.user_id = u.id join SSAT.bundle as b on r.bundle_id = b.id where u.name ILIKE $1 or b.name ILIKE $1 or u.email ILIKE $1 order by r.day;";
    let data = ((isDate) ? ['%'] : [query+'%']);
    let response = {
        rows: "",
        rowsNum: 0
    };
    let rows = [];
    pool.query(sql, data, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            if (isDate) {
                result.rows.forEach(row => {
                    let taken_date = myTools.dateFormatter(new Date(row.taken_date*1000), 'DD/MM/YYYY');
                    if(taken_date == query) {
                        rows.push(row);
                    }
                });
                response.rows = myTools.rentals.buildRentalTableRows(rows);
                response.rowsNum = rows.length;
            } else {
                response.rows = myTools.rentals.buildRentalTableRows(result.rows);
                response.rowsNum = result.rowCount;
            }
        }
        res.end(JSON.stringify(response));
    });
};

module.exports = {
    search: search,
};