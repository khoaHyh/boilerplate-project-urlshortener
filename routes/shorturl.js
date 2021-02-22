const express = require("express");
const nanoid = require('nanoid');
const Url = require('../url');

let shortUrlRoute = express.Router();

shortUrlRoute.post('/api/shorturl/new', async (req, res) => {
	const ogUrl = req.body.url;
    const baseUrl = 'http://localhost:3000/api/shorturl';

    dns.lookup(baseUrl, (err, address, family) => {
        if (err) return res.status(401).json(`baseUrl error: ${err}`);
    });

    let urlCode = nanoid();

    dns.lookup(ogUrl, async (err, address, family) => {
        if (err) return res.status(401).json(`ogUrl error: ${err}`);
        try {
            let url = await Url.findOne({ ogUrl : ogUrl });
            if (url) {
                return  res.status(200).json(url);
            } else {

                const shortUrl = baseUrl + "/" + urlCode;
                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                });
                
                await url.save();
                return res.status(201).json(url);
            }
        } catch (err) {
            console.error(err.message);
            return res.status(500).json(`Internal Server error ${err.message}`);
        }
    });

});

module.exports = shortUrlRoute;
