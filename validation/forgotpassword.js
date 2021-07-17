const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateForgotPasswordInput(data) {
  let errors = {};

  // Converting empty fields into an empty string to use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";

  // Email checks
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
