const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const databaseRecords = require('../db');

router.post("/signup", (req, res, next) => {
    
    //create user
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    
    const hash = bcrypt.hashSync(req.body.password, salt);
    const authData = {
        email: req.body.email,
        token: hash
    };
    const email = req.body.email;
    const token = hash;
    //insert to database
    try {
        databaseRecords.createKeyTraderUser(email, token, function(){
            res.redirect('/');
          },function(err){
              return res.status(500).json(err);
          });
        return res.status(201).json({msg:"success"});
    }
    catch (err) {
      return next(new BadRequest("Failed to create user", err));
    }

});

module.exports = router;