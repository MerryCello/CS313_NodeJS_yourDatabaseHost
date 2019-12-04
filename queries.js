require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const ejs = require('ejs');
const myTools = require('./tools');
const bcrypt = require('bcryptjs');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
const path = './.env'
//    if working locally, run this line of code:
fs.access(path, fs.F_OK, (err) => { if (!err) { process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; }});


/**
 * HOME
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

    // console.log('rows: '+ JSON.stringify(rows));
    return rows;
};

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

const home = {
    getTotalRows: getTotalRows,
};

const marketing = {
    getSignatures: getSignatures,
    removeSignature: removeSignature,
    addSignature: addSignature
};

const bundles = {
    getBundles: getBundles,
    addBundle: addBundle,
    removeBundle: removeBundle,
    updateBundle: updateBundle
};

const signup = {
    isUniqueUsername: isUniqueUsername,
    isUniqueEmail: isUniqueEmail,
    addNewUser: addNewUser
};

const login = {
    isValidLogin: isValidLogin
};

module.exports = {
    home: home,
    marketing: marketing,
    bundles: bundles,
    signup: signup,
    login: login
};