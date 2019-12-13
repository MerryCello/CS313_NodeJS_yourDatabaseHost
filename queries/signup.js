// npm native modules
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
// setup
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

/**
 * SIGN_UP
 */
const isUniqueUsername = async (username) => {
    let sql = 'select username from users where lower(username)=lower($1);';
    let data = [username];
    
    return await new Promise((res, rej) => {
        pool.query(sql, data, (err, result) => {
            if(err) {
                console.log(err);
                res(false);
            } else {
                if(!result.rows.length)
                    res(true);
                else
                    res(false)
            }
        });
    });
};

const isUniqueEmail = async (email) => {
    let sql = 'select email from users where lower(email)=lower($1);';
    let data = [email];
    
    let promise = new Promise((res, rej) => {
        pool.query(sql, data, (err, result) => {
            if(err) {
                console.log(err);
            } else {
                if(!result.rows.length)
                    res(true);
                else
                    res(false)
            }
        });
    });
    return await promise;
};

const addNewUser = (userInfo, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            console.log("FAILED TO GENERATE A SALT: " + err);
        } else {
            // console.log("salt: " + salt);
            bcrypt.hash(userInfo.password, salt, (err, hashedPassword) => {
                if(err) {
                    console.log("FAILED TO HASH: " + err);
                } else {
                    // console.log("hashedPassword: " + hashedPassword);
                    let sql = 'insert into users (username, password, email, schema_name) values (lower($1), $2, lower($3), $4);';
                    let data = [userInfo.username, hashedPassword, userInfo.email, userInfo.schemaCode];
                    // console.log("schemaCode: " + userInfo.schemaCode);
        
                    pool.query(sql, data, (err, result) => {
                        if(err) {
                            console.log("ERROR AT ADD_NEW_USER(): " + err);
                            res.end("failure");
                        } else {
                            res.end("success");
                        }
                    });
                }
            });
        }
    });
};

module.exports = {
    isUniqueUsername: isUniqueUsername,
    isUniqueEmail: isUniqueEmail,
    addNewUser: addNewUser
};