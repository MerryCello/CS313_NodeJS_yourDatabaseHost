const sLetters = (weight) => {
    if(weight <= 3.5) {
        let startRate = 0.55;
        let rr = 0.15;
        let table = new Map();
        let i = 1;
        for(let rate = startRate; rate<1; rate+=rr, ++i) {
            table.set(i, Math.round(rate*100)/100);
        }
        table.set(4, 1);
    
        return table.get(Math.ceil(weight));
    } else {
        return 'Weight is too eavy for a letter!';
    }
}

const mLetters = (weight) => {
    if(weight <= 3.5) {
        let startRate = 0.50;
        let rr = 0.15;
        let table = new Map();
        let i = 1;
        for(let rate = startRate; rate<0.95; rate+=rr, ++i) {
            table.set(i, Math.round(rate*100)/100);
        }
        table.set(4, 0.95);
    
        return table.get(Math.ceil(weight));
    } else {
        return 'Weight is too eavy for a letter!';
    }
}

const lgEnvelopes = (weight) => {
    if(weight <= 13) {
        let startRate = 1;
        let rr = 0.15;
        let table = new Map();
        let i = 1;
        for(let rate = startRate; i<=13; rate+=rr, ++i) {
            table.set(i, Math.round(rate*100)/100);
        }
    
        return table.get(Math.ceil(weight));
    } else {
        return 'Weight is too eavy for an envelope!';
    }
}

const fClassPkg = (weight) => {
    if(weight <= 13) {
        let startRate = 1;
        let table = new Map();
        for(let i = 1; i<=13; ++i) {
            if(i<=4) {
                table.set(i, 3.66);
            } else if(i<=8) {
                table.set(i, 4.39);
            } else if(i<=12) {
                table.set(i, 5.19);
            } else if(i<=16) {
                table.set(i, 5.71);
            }
        }
    
        return table.get(Math.ceil(weight));
    } else {
        return 'Weight is too eavy for a package!';
    }
}

const calcRates = (req, res) => {
    let weight = 1*req.query.weight;
    let mailType = req.query.mailType;
    let rate = 0;
    switch (mailType) {
        case 'Letters (Stamped)':
            rate = sLetters(weight);
            break;
        case 'Letters (Metered)':
            rate = mLetters(weight);
            break;
        case'Large Envelopes (Flats)':
            rate = lgEnvelopes(weight);
            break;
        case 'First-Class Package Service—Retail':
            rate = fClassPkg(weight);
            break;
        default:
            rate = 0;
            break;
    }

    let price = (Math.round(weight * rate * 100)/100).toFixed(2);
    rate = rate.toFixed(2);
    let data = {weight: weight, mailType: mailType, price: price, rate: rate}
    res.render('results', data);
}

module.exports = {calcRates: calcRates};
