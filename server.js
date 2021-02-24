require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./utilities/db');
const { nanoid } = require('nanoid');
const handleInput = require('./controllers/input');
const redirect = require('./controllers/redirect');

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

app.post('/api/shorturl/new', (req, res) => { handleInput(req, res) });

app.get('/api/shorturl/:urlId', (req, res) => { redirect(req,res) });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
