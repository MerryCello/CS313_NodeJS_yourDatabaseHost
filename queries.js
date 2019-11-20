const getSignatures = (req, res) => {
    let json = 'Hello!';
    let data = {data: json}
    res.render('dbResults', data);
}

module.exports = { getSignatures: getSignatures };