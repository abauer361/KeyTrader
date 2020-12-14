const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const databaseRecords = require('../db');
const { BadRequestError } = require('../errorUtil');
const jwt = require("jsonwebtoken");


router.post("/login", async (req, res, next) => {
    //get user

    //define attributes
    const username = req.body.username;

    //pull from database
    try {
        const results = await databaseRecords.getKeyTraderUsers(username);
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
          result:match,
          token:jwtInfo
        });
      }
      catch (err) {
        return next(new BadRequestError("Failed to get user authorization.", err));
      }
});

router.post("/signup", async (req, res, next) => {
    
    //create user

    //check password
    const password = req.body.password;
    /*const length = 6;
    var missing = "";
    var approved = true;
    if (password.length < length) {
      missing = missing + "\n 6+ characters";
      approved = false
    }
    
    if (approved == false) {
      next(new BadRequestError("Failed to create user.  Password requires: ${missing}", err));
      return res.status(401).json({
            msg:"Signup failed.",
            result:false
          });
    }*/

    //hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    //define attributes
    const email = req.body.email;
    const username = req.body.username;
    const token = hash;

    //insert to database
    try {
        await databaseRecords.createKeyTraderUser(email, username, token);

        return res.status(201).json({
            msg:"Signup Success",
            result: true
            });
    }
    catch (err) {
      return next(new BadRequestError("Failed to create user.  This email may already be in use.", err));
    }
});

module.exports = router;

router.post("/create-community", async (req, res, next) => {
  const communityID = req.body.communityID;
  const communityName = req.body.communityName;

  //insert to database
    try {
      await databaseRecords.addCommunity(communityID, communityName);

      return res.status(201).json({
          msg:"Community Added",
          result: true
          });
  }
  catch (err) {
    return next(new BadRequestError("Failed to create community. Try a different name.", err));
  }
});