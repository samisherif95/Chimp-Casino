const express = require("express");
const router = express.Router();
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
// const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");
// const passport = require("passport");



router.get("/test", (req, res) => {
  res.json({ msg: "this is the user route" });
});

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        // Use the validations to send the error
        errors.username = 'username already exists';
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          username: req.body.username,
          password: req.body.password
        })
      }
    })
})

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        // Use the validations to send the error
        errors.username = 'User not found';
        return res.status(404).json(errors);
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            res.json({ msg: 'Success' });
          } else {
            // And here:
            errors.password = 'Incorrect password'
            return res.status(400).json(errors);
          }
        })
    })
})

module.exports = router;




