require("dotenv").config({ path: "./.env" });

module.exports = {
  mongoURI: process.env.DB_URI,
  secretOrKey: "secret",
  emailId: process.env.EMAIL_ADDRESS,
  emailPassword: process.env.EMAIL_PASSWORD,
};
