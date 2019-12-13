// npm native modules
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
// setup
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

/**
 * LOGIN
 */
const isValidLogin = async (username, password) => {

    let isValid = false;
    // 1st, get DB password by username
    let sql = 'select password from users where lower(username)=lower($1);';
    let data = [username];

    let DBpasswordPromise = new Promise((res, rej) => {
        pool.query(sql, data, async (err, result) => {
            if(err) {
                console.log("ERROR AT ADD_NEW_USER(): " + err);
                res.end("failure");
        // 2nd, validate username and compare passwords
            } else {
                if(result.rows.length) {
                    res(result.rows[0].password);
                } else {
                    console.log("\"" + username + "\" is an invalid username");
                    res('invalid username');
                }
            }
        });
    });
    let DBpassword = await DBpasswordPromise;
    if(DBpassword != 'invalid username') { 
        if (bcrypt.compareSync(password, DBpassword)) {
        isValid = true;
        } else {
            console.log("\"" + password + "\" is an invalid password");
        }
    }

    return isValid;
};

module.exports = {
    isValidLogin: isValidLogin
};