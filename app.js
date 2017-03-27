var express = require('express');
var todoController = require('./controllers/todoController');;

var app = express();

app.set('view engine','ejs');
app.use(express.static('./public'));

//var data = [{task: 'read a book'},{task: 'pratice english'},{task: 'coding everyday'}];

todoController(app);

app.listen(8080);
console.log('Server is listening to port 8080');