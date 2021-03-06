var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var bodyParser = require('body-parser');
var moment = require('moment');
var mongoose = require('mongoose');

var currentDate = moment().format("LL");


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds155490.mlab.com:55490/heroku_0ndzzm3g');

//Schema
var userSchema = new mongoose.Schema({
    Id: Number,
    Username: String
});
var todoSchema = new mongoose.Schema({
    item: String,
    completed: Boolean,
    date: { type: Date, default: Date.now() },
    User_id: { type: mongoose.Schema.Types.Number, ref: 'User' }
});

//Model
var User = mongoose.model('User', userSchema);
var Todo = mongoose.model('Todo', todoSchema);


var urlencodedParser = bodyParser.urlencoded({ extended: false })


passport.use(new FacebookStrategy({
    clientID: '1683125035314217',
    clientSecret: '5efeae024dbfa6785c5c578c24946f13',
    callbackURL: "/auth/facebook/callback"
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
    app.use(require('express-session')({ secret: 'keyboard cat', cookie: { maxAge: 86400000 }, resave: true, saveUninitialized: true }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/', function (req, res) {
        if (req.user) {
            res.redirect('/todo');
        } else {
            res.render('login');
        }
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth' }),
        function (req, res) {
            res.redirect('/todo');
        });
    app.get('/todo', require('connect-ensure-login').ensureLoggedIn('/'),
        function (req, res) {
            Todo.find({ User_id: req.user.id, completed: false }, function (err, data) {
                if (err) throw err;
                res.render('todo', { todo: data, user: req.user, moment: currentDate });
            });
        });

    app.post('/todo', urlencodedParser, function (req, res) {
        var newTodo = new Todo(req.body);
        newTodo.completed = false;
        newTodo.date = moment().format();
        newTodo.User_id = req.user.id;
        newTodo.save(function (err, data) {
            if (err) throw err;
            res.redirect('back');
        });
    });

    app.get('/completed', require('connect-ensure-login').ensureLoggedIn('/'), function (req, res) {
        Todo.find({ User_id: req.user.id, completed: true }, function (err, data) {
            if (err) throw err;
            console.log(data.data);
            res.render('complete', { complete: data, user: req.user, moment: moment });
        });
    });

    app.get('/todo/delete/:item', function (req, res) {
        Todo.find({ item: req.params.item.replace(/\-/g, " ") }).update({ completed: true }, function (err, data) {
            if (err) throw err;
            res.json(data);
        });
    });

    //    app.delete('/todo/:item', function (req, res) {
    //        Todo.find({ item: req.params.item.replace(/\-/g, " ") }).remove(function (err, data) {
    //            if (err) throw err;
    //            res.json(data);
    //        });
    //   });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/404', function (req, res, next) {
        next();
    });

    app.get('/403', function (req, res, next) {
        var err = new Error('not allowed!');
        err.status = 403;
        next(err);
    });

    app.get('/500', function (req, res, next) {
        next(new Error('keyboard cat!'));
    });

    app.use(function (req, res, next) {
        res.status(404);

        res.format({
            html: function () {
                res.render('404', { url: req.url })
            },
            json: function () {
                res.json({ error: 'Not found' })
            },
            default: function () {
                res.type('txt').send('Not found')
            }
        })
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('500', { error: err });
    });
};
