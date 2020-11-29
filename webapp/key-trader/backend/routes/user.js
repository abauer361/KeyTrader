const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require("../models/user");

router.get('/', (req, res) => {
    console.log('testing123');
    res.status(200).json({"test" : "123"});
  });


router.post("/signup", (req, res, next) => {
    console.log('test');
    //create user
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        console.log(user);
        user.save()
        .then(result => {
            res.status(201).json({
                message: "User created.",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });
    
});

module.exports = router;