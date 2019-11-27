const fs = require('fs');
const ejs = require('ejs');
const queries = require('./queries');
const errorPage = "<h4> Error 404:</h4><p>Could not get that</p>";

/**
 * MARKETING methods
 */
const getNames = (rows) => {
    let names = [];
    rows.forEach(row => {
        names.push(row.name.replace(/^./, row.name[0].toUpperCase()));
    });
    // console.log("name: "+JSON.stringify(names));
    return names;
};
const getEmails = (rows, format) => {
    let emails;
    switch(format) {
        case 'email;':
            emails = "";
            rows.forEach(row => {
                emails += row.email + ";";
            });
            return emails;
        default:
            console.log("ERROR: In tools.js::getEmails(rows, format): \"Invalid format was past.\"");
            return false;
    }
};
const buildTableRows = (rows) => {
    // table rows
    let trs = "";
    let row = fs.readFileSync(__dirname + '/views/pages/marketing_row.ejs', 'utf8');
    let emails = [];
    let names = [];
    let IDs = [];

    rows.forEach(row => {
        IDs.push(row.id);
        names.push(row.name.replace(/^./, row.name[0].toUpperCase()));
        emails.push(row.email);
    });

    for(let i = 0; i<rows.length; ++i) {
        trs += ejs.render(row, {i: i, id: IDs[i], name: names[i], email: emails[i]});
    }
    // console.log("name: "+JSON.stringify(trs));
    return trs;
};

const marketing = {
    getNames: getNames,
    getEmails: getEmails,
    buildTableRows: buildTableRows
};

/**
 * HOME methods
 */
const getHomePage = async (username) => {
    let rows = queries.getTotalRows();
    // let rows = {bun: 0, ren: 0, sig: 0};
    let html = fs.readFileSync(__dirname + '/views/pages/home.ejs', 'utf8');
    return ejs.render(
        html,
        {
            name: username,
            bundlesNum: rows.bun,
            rentalsNum: rows.ren,
            signNum: rows.sig
        }
    );
};

const home = {
    getHomePage: getHomePage
};

/**
 * BUNDLES methods
 */
const buildBundleTableRows = (rows) => {
    // table rows
    let trs = "";
    let row = fs.readFileSync(__dirname + '/views/pages/bundle_row.ejs', 'utf8');
    let IDs = [];
    let names = [];
    let descriptions = [];
    let prices = [];
    let img_url = [];

    rows.forEach(row => {
        IDs.push(row.id);
        names.push(row.name);
        descriptions.push(row.description);
        prices.push((Math.round(row.price * 100)/100).toFixed(2));
        img_url.push(row.img_url);
    });

    try {
        for(let i = 0; i<rows.length; ++i) {
            trs += ejs.render(
                row,
                {
                    i: i,
                    id: IDs[i],
                    name: names[i],
                    description: descriptions[i],
                    price: prices[i],
                    img_url: img_url[i]
                }
            );
        }
    } catch (e) {
        console.log('Cannot build bundle TRs: '+e.message);
    }
    // console.log("name: "+JSON.stringify(trs));
    return trs;
};

const bundles = {
    buildBundleTableRows: buildBundleTableRows
};

module.exports = {
    errorPage: errorPage,
    home: home,
    bundles: bundles,
    marketing: marketing
};