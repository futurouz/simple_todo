var bodyParser = require('body-parser');
var todoDatabase = require('mongoose');
todoDatabase.Promise = global.Promise;
todoDatabase.createConnection('mongodb://test:test@ds143330.mlab.com:43330/todo2');

var todoSchema = todoDatabase.Schema({
    item: String
});
var Todo = todoDatabase.model('Todo', todoSchema);

var urlencodedParser = bodyParser.urlencoded({ extended: false })


module.exports = function (app) {
    app.get('/todo', require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            var facebookData = req.query.face;
            Todo.find({}, function (err, data) {
                if (err) throw err;
                var facebookData = req.user;
                res.render('todo', { todo: data, user: facebookData });
            });
        });
    app.post('/todo', urlencodedParser, function (req, res) {
        var newTodo = new Todo(req.body).save(function (err, data) {
            if (err) throw err;
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