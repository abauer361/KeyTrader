const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const databaseRecords = require('../db');
const { BadRequestError } = require('../errorUtil');
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res, next) => {
    //get user

    //define attributes
    const email = req.body.email;

    //pull from database
    try {
        const results = await databaseRecords.getKeyTraderUsers(email);
        const keyJson = JSON.parse(JSON.stringify(results));
        
        var match = false;
        var account;
        //we used the primary key, so array should be size 1
        for (const user in keyJson) {
          var check = bcrypt.compareSync(req.body.password,keyJson[user].Token);
          if (match == false) {
            match = check;
            account = keyJson[user];
          }
        }
        if (!match) {
          next(new BadRequestError("Failed to get user authorization", err));
          return res.status(401).json({
            msg:"Login Failed",
            result:match
          });
        }
              
        const jwt_key = 'softwareengineeringismymajorandwegraduateinmay';
        const jwt_expires = 3600;

        const json_token = jwt.sign({username: account.email, id: account.email, token: account.token}, jwt_key, {
          algorithm: 'HS256',
          expiresIn: jwt_expires
        });

        const jwtInfo = {'token': json_token, 'expiresIn': 3600 };

        res.cookie('jwt', JSON.stringify(jwtInfo));

        return res.status(200).json({
          msg:"Login Success",
          result:match
        });
      }
      catch (err) {
        return next(new BadRequestError("Failed to get user authorization", err));
      }
});

router.post("/signup", async (req, res, next) => {
    
    //create user

    //hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    //define attributes
    const email = req.body.email;
    const token = hash;

    //insert to database
    try {
        await databaseRecords.createKeyTraderUser(email, token);

        return res.status(201).json({
            msg:"Signup Success",
            result: true
            });
    }
    catch (err) {
      return next(new BadRequestError("Failed to create user", err));
    }
});

module.exports = router;