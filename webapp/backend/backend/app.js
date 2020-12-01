const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const handleErrors = require('../middleware/handleErrors');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../src/index.html'));
});



app.use('/api/discord', require('./discord'));
app.use('/api/user', require('./routes/user'));


app.use(handleErrors); // register error handler middleware
module.exports = app;


