const express = require('express');
const path = require('path');
const app = express();
const ejs = require('ejs');
const port = 3000;
const helmet = require("helmet");
require("./db/conn")


app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json({ limit: "5kb" }));
app.use(express.urlencoded({ extended: false, limit: "5kb" }));
//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', registerRouter);

app.get('/home', function (req, res) {
    res.render('home', { username: null });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.\nGoto the link:http://localhost:${port}`);
});