var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds155490.mlab.com:55490/heroku_0ndzzm3g');

//Schema
var userSchema = new mongoose.Schema({
    Id: Number,
    Username: String
});
var todoSchema = new mongoose.Schema({
    item: String,
    User_id: { type: mongoose.Schema.Types.Number, ref: 'User' }
});

//Model
var User = mongoose.model('User', userSchema);
var Todo = mongoose.model('Todo', todoSchema);


var urlencodedParser = bodyParser.urlencoded({ extended: false })


passport.use(new FacebookStrategy({
    clientID: '1683125035314217',
    clientSecret: '5efeae024dbfa6785c5c578c24946f13',
    callbackURL: "http://localhost:3030/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOne({ Id: profile.id }, function (err, user) {
            if (err) {
                console.log(err);
            }
            if (!err && user != null) {
                return cb(null, profile);
            } else {
                user = new User({
                    Id: profile.id,
                    Username: profile.displayName
                });
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        return cb(null, profile);
                    }
                });
            }
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});



module.exports = function (app) {
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

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth' }),
        function (req, res) {
            res.redirect('/todo');
        });
    app.get('/todo', require('connect-ensure-login').ensureLoggedIn('/'),
        function (req, res) {
            var facebookData = req.query.face;
            Todo.find({ User_id : req.user.id }, function (err, data) {
                if (err) throw err;
                var facebookData = req.user;
                res.render('todo', { todo: data, user: facebookData });
            });
        });
    app.post('/todo', urlencodedParser, function (req, res) {
        var newTodo = new Todo(req.body);
        newTodo.User_id = req.user.id;
        newTodo.save(function(err,data){
            if(err) throw err;
            res.redirect('back');
        });
    });
    app.delete('/todo/:item', function (req, res) {
        Todo.find({ item: req.params.item.replace(/\-/g, " ") }).remove(function (err, data) {
            if (err) throw err;
            res.json(data);
        });
    });
};
