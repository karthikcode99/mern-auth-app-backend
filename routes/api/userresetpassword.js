const express = require("express");
const router = express.Router();

// Loading User model
const User = require("../../models/User");

// @route POST api/users/resetpassword
// @desc Registered user reset password
// @access Public

router.get("/", (req, res) => {
  const resetPassword = {
    resetPasswordToken: req.query.resetPasswordToken,
    resertPasswordExpires: { $gt: Date.now() },
  };

  User.findOne({ resetPassword }).then((user) => {
    console.log(resetPassword);
    if (!user) {
      console.error("password reset link is invalid or has expired");
      res.status(403).send("password reset link is invalid or has expired");
    } else {
      res.status(200).send({
        email: user.email,
        message: "password reset link matched",
      });
    }
  });
});

module.exports = router;
