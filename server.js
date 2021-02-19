require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Implement a Root-Level Request Logger Middleware
app.use((req, res, next) => {
    console.log(req.method + " " + req.path + " - " + req.ip);
    next();
});

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

app.post('/api/shorturl/new', (req, res) => {
	let original = req.body.url;
	dns.lookup(original, (err, add, fam) => {
		if (err) return console.error(`dns lookup error: ${err}`);
		console.log(`add: ${add}, fam: ${fam}`);
	});
  	res.status(200).json({ original_url: original, short_url: req.body.url  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
