const express = require('express');
const rateLimit = require('express-rate-limit')
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');

// Rate limiting based on number of requests on certain period.
const limiter = rateLimit({
  windowMs: 5000, // 5 sec 
  max: 5, // Limit each IP to 5 requests per `window` (here, per 5 sec)
  message: "Too many requests from this IP",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// GET Login page. 
router.get('/', function (req, res, next) {
  res.render('index', { error: null });
});

// POST method for retrieving user input
router.post('/', limiter, async function (req, res) {

  // Error Handling with try catch
  try {
    // Assign username and password retrieved from the request body  
    const username = req.body.username;
    const pass = req.body.password;

    // Find user from the User Model.
    const userRegister = await User.findOne({ username: username });

    // Checking if the password given matches the stored password.
    const isMatch = await bcrypt.compare(pass, userRegister.password);
    
    // If the password matches, Login the user.
    if (isMatch) {
      res.render("home", { username });
    }
    // If the password doesn't match, throw an error.
    else {
      const error = "The password is incorrect.";
      res.render('index', { error });
    }
  }
  // In case of an error, throw an error.
  catch (err) {
    const error = "The user wasn't found.";
    res.render('index', { error });
  }

});

module.exports = router;
