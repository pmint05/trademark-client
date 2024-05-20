require("dotenv").config();
const express = require('express');
const db = require('./config/db');
const port = 3000;
const app = express();
const route = require('./routes');
const bodyParser = require('body-parser');

db.connect();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
route(app)

app.listen(port, console.log(`App running at http://localhost:${port}`));

