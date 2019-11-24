const fs = require('fs');
const ejs = require('ejs');
const errorPage = "<h4> Error 404:</h4><p>Could not get that</p>";

const getNames = (rows) => {
    let names = [];
    rows.forEach(row => {
        names.push(row.name.replace(/^./, row.name[0].toUpperCase()));
    });
    // console.log("name: "+JSON.stringify(names));
    return names;
}
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
}
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
}

const marketing = {
    getNames: getNames,
    getEmails: getEmails,
    buildTableRows: buildTableRows
};

module.exports = {
    errorPage: errorPage,
    marketing: marketing
};