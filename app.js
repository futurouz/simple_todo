var express = require('express');
var userControoler = require('./controllers/userController');
var todoController = require('./controllers/todoController');;

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));

userControoler(app);
todoController(app);

app.listen(3030);
console.log('Server is listening to port 3030');