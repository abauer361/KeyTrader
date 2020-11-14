const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const handleErrors = require('./handleErrors')

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

app.use((err, req, res, next) => {
  if (err.message === 'NoCodeProvided') {
    return res.status(400).send({
      status: 'ERROR',
      error: err.message,
    });
  } else {
    return res.status(500).send({
      status: 'ERROR',
      error: err.message,
    });
  }
});


app.use('/api/discord', require('./discord'));

module.exports = app;
