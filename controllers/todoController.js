var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Connect To db
mongoose.connect('mongodb://test:test@ds143330.mlab.com:43330/todo2');

var todoSchema = mongoose.Schema({
    item: String
});
var Todo = mongoose.model('Todo', todoSchema);

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//var data = [{ task: 'read a book' }, { task: 'pratice english' }, { task: 'coding everyday' }];

module.exports = function (app) {
    app.get('/todo', function (req, res) {
        Todo.find({}, function (err, data) {
            if (err) throw err;
            res.render('todo', { todo: data });
        });
    });
    app.post('/todo', urlencodedParser, function (req, res) {
        var newTodo = new Todo(req.body).save(function (err, data) {
            if (err) throw err;
            res.redirect('back');
       });
});
app.delete('/todo/:item', function (req, res) {
    // do something
});
};