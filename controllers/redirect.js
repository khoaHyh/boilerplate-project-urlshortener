const Url = require('../models/url');

// Redirect user to original url given the base url with short_url appended
const redirect = async (req, res) => {
    let inputId = req.params.urlId;
    console.log(`inputId: ${inputId}`);
    let url = await Url.findOne({ short_url: inputId }); 
    try {
        console.log(`Redirect to: ${url.original_url}`);
        res.redirect(url.original_url);
    } catch (err) {
        return console.error(`GET redirect error: ${url}`);
    }
};

module.exports = redirect
