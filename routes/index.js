const express = require('express');
const rateLimit = require('express-rate-limit')
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');

const limiter = rateLimit({
	windowMs: 5000, // 5 sec 
	max: 5, // Limit each IP to 5 requests per `window` (here, per 5 sec)
  message: "Too many requests from this IP",
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {error: null});
});

router.post('/',limiter, async function(req, res){

  try{
  const username = req.body.username; 
  const pass = req.body.password;

  const userRegister = await User.findOne({username:username});
  const isMatch = await bcrypt.compare(pass, userRegister.password);

  if(isMatch){
    res.render("home", {username});
  }
  else{
    const error = "The password is incorrect.";
    res.render('index', {error});
  }
}
catch(err){
  const error = "The user wasn't found.";
  res.render('index', {error});
}

});

module.exports = router;
