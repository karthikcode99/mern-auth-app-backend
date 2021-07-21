const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Loading input validation
const validateForgotPasswordInput = require("../../validation/forgotpassword");

// Loading User model
const User = require("../../models/User");

// @route POST api/users/forgotpassword
// @desc Registered user forgot password
// @access Public
router.post("/", (req, res) => {
  // Validating form
  const { errors, isValid } = validateForgotPasswordInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;

  // Finding user by email
  User.findOne({ email }).then((user) => {
    // Checking if user exists
    if (!user) {
      return res.status(404).json("email not in database");
    } else {
      // If user exists in database
      // Generating random string
      const token = crypto.randomBytes(20).toString("hex");
      user.update({
        $addfields: {
          resetPasswordToken: token,
          resertPasswordExpires: Date.now() + 3600000,
        },
      });
      console.log(user);
      console.log(token);

      // Creating reusable transporter object
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: keys.emailId,
          pass: keys.emailPassword,
        },
      });

      // Sending mail to the User
      const mailOptions = {
        from: "mydemologinwebapp@gmail.com",
        to: `${user.email}`,
        subject: "Link to Reset Password",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
          `http://localhost:5001/reset/${token}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };
      console.log("sending mail");

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error("there was an error: ", err);
        } else {
          console.log("here is the res: ", response);
          res.status(200).json("recovery email sent");
        }
      });
    }
  });
});

module.exports = router;
