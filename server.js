require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
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

// Helper function to return json object
const showJson = (res, code, orig, short) => {
    return res.status(code).json({ 
        original_url: orig, 
        short_url: short 
    });
}

// Return a json object based on whether or not the submitted url exists already
// in the database
app.post('/api/shorturl/new', (req, res) => {
    let originalUrl = req.body.url;

    dns.lookup(originalUrl, async (err, address, family) => {
        let url = await Url.findOne({ original_url: originalUrl });
        if (url) {
            showJson(res, 200, url.original_url, url.short_url);
        } else {
            let urlId = nanoid();

            url = new Url({
                original_url: originalUrl,
                short_url: urlId
            });

            url.save((err, doc) => {
                if (err) return console.error(`save error: ${err}`);
                console.log("Document inserted successfully");
                showJson(res, 201, url.original_url, url.short_url);
            });
        }
    });
});

app.get('/api/shorturl/:urlId', async (req, res) => {
    let inputId = req.params.urlId;
    console.log(`inputId: ${inputId}`);
    let url = await Url.findOne({ short_url: inputId }); 
    if (url) {
        console.log(`GET request error, if: ${url.original_url}`);
        res.redirect(url.original_url);
    } else {
        return console.error(`GET request error, else: ${url}`);
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
