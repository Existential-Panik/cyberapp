const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const fetch = require('isomorphic-fetch');


/* GET register page. */
router.get('/', function (req, res, next) {
  res.render('register', { error: null });
});

// POST register page to get input.
router.post('/', [

  //Input validation on the server-side

  check('username', 'Username is required.') // Username cannot be empty.
    .trim()
    .notEmpty()
    .escape(),

  check('email', 'Email criteria is not met.') //Email Has to be well formatted.
    .trim()
    .notEmpty()
    .isEmail()
    .normalizeEmail(),

  check('password', 'Password criteria must be met.')// Checking list of secure criteria.
    .trim()
    .notEmpty()
    .custom((value, { req }) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/.test(value) && value.length >= 8),

  check('confirmPass', 'Passwords do not match.')// Checking password and confirm passwrod
    .trim()
    .notEmpty()
    .custom((value, { req }) => value === req.body.password)

], async (req, res) => {

  //defining the errors with caught validation middleware
  const errors = validationResult(req);

  //Check if there are any errors
  if (!errors.isEmpty()) {

    //Render the errors to the user.
    const alert = errors.array();
    res.render('register', { alert, error: null });
  }

  //When there are no errors, proceed to captcha verification.
  else {

    // getting site key from client side
    const response_key = req.body["g-recaptcha-response"];

    // secret key here, which we get from google console
    const secret_key = "6LffxSglAAAAAHzr7RL1vPKRtv5QIbZ_sCr0asRb";

    // Hitting POST request to the URL, Google will
    // respond with success or error scenario.
    const url =
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

    // Making POST request to verify captcha
    fetch(url, {
      method: "post",
    })
      .then((response) => response.json())
      .then(async (google_response) => {

        // google_response is the object return by
        // google as a response
        if (google_response.success == true) {

          //getting the user inputs from request body
          const { username, email, password } = req.body;

          //hashing password
          const hashedPass = await bcrypt.hash(password, 10);

          //if captcha is verified, create the users and save in database.
          const newUser = await User.create({ username, email, password: hashedPass });

          //Goto Login Route.
          res.redirect('/');

        } else {
          // if captcha is not verified, throw an error
          const error = 'Captcha Verification failed.';
          res.render('register', { error });
        }
      })
      .catch((error) => {
        // Some error while verifying captcha
        return res.json({ error });
      });

  }
});

module.exports = router; 