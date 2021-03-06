const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const databaseRecords = require('../db');
const { BadRequestError, InternalServerError } = require('../errorUtil');
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

router.post("/load-community", async (req, res, next) => {

  const username = req.body.username;
  //load community
    try {
      const results = await databaseRecords.getCommunity(username);
      const keyJson = JSON.parse(JSON.stringify(results));
      let roleDataArray = [];

      for (const data in keyJson) {
        const communityID = keyJson[data].Community_ID;
        const communityName = keyJson[data].Community_ID;
        roleDataArray.push({ communityID: communityID, roleType: communityName });
    }
    res.status(200).json({ message: "Success: Loaded communities", communities: roleDataArray });

  
  }
  catch (err) {
    console.log(err);
    return next(new InternalServerError("Cannot get communities.", err));
  }
});

router.post("/load-roles", async (req, res, next) => {

  const communityID = req.body.communityID;
  //load community
    try {
      const results = await databaseRecords.getCommunityRole(communityID);
      const keyJson = JSON.parse(JSON.stringify(results));
      let roleDataArray = [];

      for (const data in keyJson) {
        const username = keyJson[data].Username;
        const role = keyJson[data].Role_Name;
        roleDataArray.push({ communityID: communityID, username: username, role:role });
    }
    res.status(200).json({ message: "Success: Loaded roles", communityRoles: roleDataArray });

  
  }
  catch (err) {
    console.log(err);
    return next(new InternalServerError("Cannot get communities.", err));
  }
});

router.post("/create-community", async (req, res, next) => {
  const communityID = req.body.communityID;
  const communityName = req.body.communityName;
  const communityLink = ' ';
  
  //insert to database
    try {
      await databaseRecords.addCommunity(communityID, communityName, communityLink);

      return res.status(201).json({
          msg:"Community Added",
          result: true
          });
  }
  catch (err) {
    return next(new InternalServerError("Cannot create community.", err));
  }
});

router.post("/create-key", async (req, res, next) => {
  const communityID = req.body.communityID;
  const key = req.body.keyString;
  
  //insert to database
    try {
      await databaseRecords.createCommunityKey(communityID, key);

      return res.status(201).json({
          msg:"Community key Added",
          result: true
          });
  }
  catch (err) {
    console.log(err);
    return next(new BadRequestError("Failed to create key.  It may already be in use.  Try a different key.", err));
  }
});

router.post("/remove-key", async (req, res, next) => {
  const key = req.body.key;

  //remove from db
    try {
      await databaseRecords.removeCommunityKey(key);
      
      return res.status(201).json({
          msg:"Key removed",
          result: true
          });
  }
  catch (err) {
    console.log(err);
    return next(new BadRequestError("Failed to remove key from community.", err));
  }
});

router.post("/get-keys", async (req, res, next) => {
  const communityID = req.body.communityID;
  
  //insert to database
    try {
      const results = await databaseRecords.getCommunityKeys(communityID);
      const keyJson = JSON.parse(JSON.stringify(results));
      let roleDataArray = [];

      for (const data in keyJson) {
        const communityID = keyJson[data].Community_ID;
        const keyString = keyJson[data].KeyString;
        roleDataArray.push({ communityID: communityID, keyString: keyString });
      }
      return  res.status(200).json({ message: "Success: Loaded roles", key: roleDataArray });
      
     
  }
  catch (err) {
    console.log(err);
    return next(new InternalServerError("Cannot get community keys.", err));
  }
});

router.post("/get-roles", async (req, res, next) => {
  const communityID = req.body.communityID;
  
  //insert to database
    try {
      const results = await databaseRecords.getCommunityRole(communityID);
      const keyJson = JSON.parse(JSON.stringify(results));
      
        
      return res.status(201).json({
          msg:"Role found",
          result: keyJson
          });
  }
  catch (err) {
    return next(new BadRequestError("Failed to create community role. Try again later.", err));
  }
});

router.post("/remove-user", async (req, res, next) => {
  const communityID = req.body.communityID;
  const username = req.body.username;

  //insert to database
    try {
      await databaseRecords.removeCommunityUser(communityID, username);
      
      return res.status(201).json({
          msg:"User removed",
          result: true
          });
  }
  catch (err) {
    return next(new BadRequestError("Failed to remove user from community.", err));
  }
});

router.post("/update-role", async (req, res, next) => {
  const communityID = req.body.communityID;
  const username = req.body.username;
  const role = req.body.role;

  //insert to database
    try {
      await databaseRecords.addCommunityRole(communityID, username, role);
      
      return res.status(201).json({
          msg:"Role created",
          result: true
          });
  }
  catch (err) {
    return next(new BadRequestError("Failed to update community role. Try again later.", err));
  }
});

module.exports = router;