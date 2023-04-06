const express = require('express');
const path = require('path');
const app = express();
const ejs = require('ejs');
const port = 3000;
const helmet = require("helmet");

//importing the database connection
require("./db/conn");

//importing routes Routes
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');

// Setting up the helmet header security policies
// Specifically defining some Content Security Policy header directives
app.use(
    helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "www.gstatic.com", "ka-f.fontawesome.com", "https://www.google.com/recaptcha/api.js", "https://kit.fontawesome.com/af562a2a63.js"],
      "font-src": ["'self'", "www.gstatic.com", "ka-f.fontawesome.com", "fonts.gstatic.com"],
      "frame-src": ["www.google.com"],
      "connect-src":["ka-f.fontawesome.com"]

    },
  })
);



//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json({ limit: "5kb" }));
app.use(express.urlencoded({ extended: false, limit: "5kb" }));

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes for login and register
app.use('/', indexRouter);
app.use('/register', registerRouter);

//Route for Home
app.get('/home', function (req, res) {
    res.render('home', { username: null });
});

// Listening on PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}.\nRun the app on - http://localhost:${port}`);
});