const dns = require('dns');
const { nanoid } = require('nanoid');
const Url = require('../models/url');
const getJson = require('../utilities/getJson');

const handleInput = (req, res) => {
    let regex = /^https?:///;
    let originalUrl = req.body.url;
    
    // Ensure url follows http://example.com format
    if (regex.test(originalUrl)) {
        // https://forum.freecodecamp.org/t/help-with-node-js-dns-lookup/311144
        // need to remove http(s):// to pass to dns.lookup
        let tempDnsUrl = originalUrl.slice(originalUrl.indexOf("//") + 2); 
        // need to remove anythng past .com, etc., for dns.lookup
        let slashIndex = tempDnsUrl.indexOf("/"); 
        let dnsUrl = slashIndex < 0 ? tempDnsUrl : tempDnsUrl.slice(0, slashIndex);
        // Ensure the url is a valid one
        dns.lookup(dnsUrl, async (err, address, family) => {
            if (err) {
                console.error(`DNS lookup error: ${err}`);
                return res.status(404).json({ error: 'invalid url' });
            }

            // Check if the url is already in the database and act accordingly
            let url = await Url.findOne({ original_url: originalUrl });
            if (url) {
                console.log(url.original_url);
                getJson(res, 200, url.original_url, url.short_url);
            } else {
                let urlId = nanoid();

                url = new Url({
                    original_url: originalUrl,
                    short_url: urlId
                });

                url.save((err, doc) => {
                    if (err) return console.error(`save error: ${err}`);
                    console.log("Document inserted successfully");
                    getJson(res, 201, url.original_url, url.short_url);
                });
            }
        });
    } else {
        console.error(`${originalUrl} does not have the valid 'http://example.com format'`);
        return res.json({ error: 'invalid url' });
    }
};

module.exports = handleInput
