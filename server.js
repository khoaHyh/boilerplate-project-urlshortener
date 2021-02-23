require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./db');
const { nanoid } = require('nanoid');

// Implement a Root-Level Request Logger Middleware
app.use((req, res, next) => {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
});

connectDB();

// Use body-parser to Parse POST Requests
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  	res.sendFile(process.cwd() + '/views/index.html');
});

const urlSchema = new mongoose.Schema({
	original_url: String,
	short_url: String,
});

const Url = mongoose.model("url", urlSchema);

app.post('/api/shorturl/new', (req, res) => {
    let originalUrl = req.body.url;
    let urlId = nanoid();

    dns.lookup(originalUrl, async (err, address, family) => {
        if (err) return res.status(401).json(`dns lookup error: ${err}`);

        try {
            let url = await Url.findOne({ original_url: originalUrl });
            if (url) {
                return res.status(200).json({ original_url: originalUrl, short_url: urlId });
            } else {
                url = new Url({
                    original_url: originalUrl,
                    short_url: urlId
                });
                
                url.save((err, doc) => {
                    if (err) return console.error(`save error: ${err}`);
                    console.log("Document inserted successfully");
                    res.status(201).json({
                        original_url: url.original_url,
                        short_url: url.short_url
                    });
                });
            }
        } catch (err) {
            console.error(err.message);
            return res.status(500).json(`Internal Server error ${err.message}`);
        }
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
