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

const TIMEOUT = 10000;

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
        let url = await Url.findOne({ original_url: originalUrl });
        if (url) {
            res.status(200).json(url);
        } else {
            url.save((err, doc) => {
                if (err) return console.error(`save error: ${err}`);
                console.log("Document inserted successfully");
                res.status(201).json({
                    original_url: url.original_url,
                    short_url: url.short_url
                });
            });
        }
    });
});

app.get('/api/shorturl/:urlId', async (req, res) => {
    let inputId = req.params.urlId;
    let url = await Url.find({ short_url: inputId }); 
    if (url) {
        res.redirect(url[0].original_url);
    } else {
        console.error(`else: ${url}`);
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
