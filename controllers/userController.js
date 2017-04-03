var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var userDatabase = require('mongoose');
userDatabase.Promise = global.Promise;
userDatabase.createConnection('mongodb://test:test@ds143330.mlab.com:43330/todo2');

var userSchema = userDatabase.Schema({
    Id: Number,
    Username: String
});

var User = userDatabase.model('User',userSchema);


module.exports = function (app) {
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
            res.redirect('/todo');
        });

};