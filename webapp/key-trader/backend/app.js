const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.get('/', (req, res) =>
{
  res.status(200).sendFile(path.join( __dirname, '../src/index.html'));
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

app.get('/callback', (req, res) =>
{
  res.status(200).sendFile(path.join( __dirname, '../src/app/UserInformation/userInfo.component.html'));
});

app.use('/api/discord', require('./discord'));

app.get('/api/getAllUsers', (req, res, next) => {
  db.getUsers(function(results){
    res.status(200).json(results);
  }, function (err) {
    res.status(500).json(err);
  })
})

app.get('/api/viewAllKeys', (req, res, next)=>{
  db.getKeys(function(results){
    console.log('success');
    res.status(200).json(results);
  }, function(err){
    res.status(500).json(err);
  })
})



module.exports = app;
