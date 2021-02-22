const express = require("express");
const Url = require("../url");

let getShortUrlRoute = express.Router();
getShortUrlRoute.get('/api/shorturl/:shortUrl', async (req, res) => {
    let shortUrlCode = req.params.shortUrl;
    let url = await Url.findOne({ urlCode: shortUrlCode });

    try {
        if (url) {
            return res.redirect(url.longUrl);
        } else {
            return res.status(400).json("The short url doesn't exist in our system.");
        }
    }
    catch (err) {
        console.error(`Error while retrieving long url for shorturlcode ${shortUrlCode}`);
        return res.status(500).json("There is some internal error.");
    }
});

module.exports = getShortUrlRoute;
