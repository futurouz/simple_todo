var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var todoController = require('./controllers/todoController');;

passport.use(new FacebookStrategy({
    clientID: '1683125035314217',
    clientSecret: '5efeae024dbfa6785c5c578c24946f13',
    callbackURL: "http://localhost:3030/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());



app.get('/', function (req, res) {
    res.render('login');
});

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth' }),
    function (req, res) {
        res.redirect('/profile');
    });
app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        var data = req.user;
        res.redirect('/todo/?face=' + data);
    });


//var data = [{task: 'read a book'},{task: 'pratice english'},{task: 'coding everyday'}];
todoController(app);

app.listen(3030);
console.log('Server is listening to port 3030');