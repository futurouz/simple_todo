var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Connect To db
mongoose.connect('mongodb://test:test@ds035240.mlab.com:35240/todo');

var todoSchema = mongoose.Schema({
    item: String
});
var Todo = mongoose.model('Todo',todoSchema);

var urlencodedParser = bodyParser.urlencoded({ extended: false })

var data = [{ task: 'read a book' }, { task: 'pratice english' }, { task: 'coding everyday' }];

module.exports = function (app) {
    app.get('/todo', function (req, res) {
        res.render('todo', { todo: data });
    });
    app.post('/todo', function (req, res) {
        // do something
    }); 
    app.delete('/todo/:item', function (req, res) {
        // do something
    });
};