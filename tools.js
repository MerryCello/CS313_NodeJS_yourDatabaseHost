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
    return trs;
};

/**
 * OVERVIEW methods
 */
// const getOverviewPage = async (username) => {
//     console.log('here');
//     let rows = queries.getTotalRows();
//     let html = fs.readFileSync(__dirname + '/views/pages/overview.ejs', 'utf8');
//     return ejs.render(
//         html,
//         {
//             name: username,
//             bundlesNum: rows.bun,
//             rentalsNum: rows.ren,
//             signNum: rows.sig
//         }
//     );
// };

/**
 * RENTAL methods
 */
const buildRentalTableRows = (rows) => {
    let trs = "";
    let html = fs.readFileSync(__dirname + '/views/pages/rental-row.ejs', 'utf8');
    let i = 0;
    rows.forEach(row => {
        let data = {
            i: i,
            id: row.id,
            bundle_name: row.bundle_name,
            user_name: row.user_name,
            userEmail: row.user_email,
            takenDate: dateFormatter(new Date(row.taken_date*1000), 'DD/MM/YYYY HH:mm')
        };
        trs += ejs.render(html, data);
        i++;
    });
    return trs;
};

const dateFormatter = (date, pattern) => {
    if(!(date instanceof Date)) {
        return null;
    }
    
    let HH = date.getHours();
    let mm = date.getMinutes();
    let DD = date.getDate();
    let MM = date.getMonth()+1;
    let YYYY = date.getFullYear();
    HH = (HH < 10) ? "0"+HH : HH;
    mm = (mm < 10) ? "0"+mm : mm;
    DD = (DD < 10) ? "0"+DD : DD;
    MM = (MM < 10) ? "0"+MM : MM;
    
    // Using a switch for now, but if this gets more sofisticated
    // the function will reflect that
    switch (pattern) {
        case 'DD/MM/YYYY HH:mm':
            return DD + "/" + MM + "/" + YYYY + " " + HH + ":" + mm;
        case 'DD/MM/YYYY':
            return DD + "/" + MM + "/" + YYYY;
        default:
            return 'N/A';
    }
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
    return trs;
};

const marketing = {
    getNames: getNames,
    getEmails: getEmails,
    buildTableRows: buildTableRows
};

// const overview = {
//     getOverviewPage: getOverviewPage
// };

const rentals = {
    buildRentalTableRows: buildRentalTableRows,
};

const bundles = {
    buildBundleTableRows: buildBundleTableRows
};

module.exports = {
    marketing: marketing,
    // overview: overview,
    rentals: rentals,
    bundles: bundles,
    dateFormatter: dateFormatter,
    errorPage: errorPage
};