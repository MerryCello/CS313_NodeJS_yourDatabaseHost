const express    = require('express');
const queries    = require('../queries');
const myTools    = require('../tools');
const ejs        = require('ejs');
const fs         = require('fs');
const router = express.Router();

// goes to dashboard if there is a valid session
// else goes to redirect for login
router.get('/dashboard', async (req, res) => {
    sess = req.session;
    if(sess.username) {
        // by default send to overview page
        // let page = myTools.overview.getOverviewPage();
        let rows = await queries.overview.getTotalRows();
        // let rows = {bun: 0, ren: 0, sig: 0};
        let html = fs.readFileSync(__dirname + '/../views/pages/overview.ejs', 'utf8');
        let page = ejs.render(
            html,
            {
                name: sess.username,
                bundlesNum: rows.bun,
                rentalsNum: rows.ren,
                signNum: rows.sig
            }
        );
        // initialize page
        data = {
            page: page,
            title: "Dashboard - Overview",
            icon_url: "/media/db.jpg",
            tab1: "/dashboard/overview",
            titleTab1: "Dashboard - Overview",
            tab2: "/dashboard/bundles",
            titleTab2: "Dashboard - Bundles",
            tab3: "/dashboard/rentals",
            titleTab3: "Dashboard - Rentals",
            tab4: "/dashboard/marketing",
            titleTab4: "Dashboard - Marketing",
            searchRentalsHref: "/searchRentals",
            logout: "/logout",
            about: "/about"
        }
        res.render('dashboard', data);
    } else {
        res.redirect('/');
    }
});

router.get('/dashboard/:tab', async (req, res) => {
    sess = req.session;
    if(sess.username) {
        let page;
        let html;
        switch(req.params.tab) {
            case 'overview':
                // page = myTools.overview.getOverviewPage(sess.username);
                let rows = await queries.overview.getTotalRows();
                // let rows = {bun: 0, ren: 0, sig: 0};
                html = fs.readFileSync(__dirname + '/../views/pages/overview.ejs', 'utf8');
                page = ejs.render(
                    html,
                    {
                        name: sess.username,
                        bundlesNum: rows.bun,
                        rentalsNum: rows.ren,
                        signNum: rows.sig
                    }
                );
                break;
            case 'bundles':
                queries.bundles.getBundles(req, res);
                return;
            case 'rentals':
                html = fs.readFileSync(__dirname + '/../views/pages/rentals.ejs', 'utf8');
                page = ejs.render(html, { searchRentalsHref: '/searchRentals' });
                break;
            case 'marketing': 
                queries.marketing.getSignatures(req, res);
                return;
            default:
                page = myTools.errorPage;
                break;
        }
        res.setHeader('Content-Type', 'text/html');
        res.send(page);
    } else {
        res.redirect('/');
    }
});

module.exports = router;