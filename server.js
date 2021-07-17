const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");

const usersRegistration = require("./routes/api/usersregistration");
const usersLogin = require("./routes/api/userslogin");
const usersForgotPassword = require("./routes/api/usersforgotpassword");

app.use(express.json());

// Database Config
const db = require("./config/keys").mongoURI;

// Connecting to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/users/register", usersRegistration);
app.use("/users/login", usersLogin);
app.use("/users/forgotpassword", usersForgotPassword);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
