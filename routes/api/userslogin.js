const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Loading input validation
const validateLoginInput = require("../../validation/login");

// Loading User model
const User = require("../../models/User");

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/", (req, res) => {
  // Validating form
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Finding user by email
  User.findOne({ email }).then((user) => {
    // Checking if user exists
    if (!user) {
      return res.status(404).json("Email not found");
    }
    // Checking password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // If user matched, then creating payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Signing a token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer" + token,
              message: "User found and logged in",
            });
          }
        );
      } else {
        return res.status(400).json("Password incorrect");
      }
    });
  });
});

module.exports = router;
