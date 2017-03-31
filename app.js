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

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));


app.get('/', function (req, res) {
    res.render('home', { user: req.user });
});

app.get('/auth',function(req,res){
    res.render('login');
});

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

//var data = [{task: 'read a book'},{task: 'pratice english'},{task: 'coding everyday'}];
todoController(app);

app.listen(3030);
console.log('Server is listening to port 3030');