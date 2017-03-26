var express = require('express');
var app = express();

app.set('view engine','ejs');
app.use(express.static('./public'));

app.get('/todo',function(req,res){
    res.render('todo');
});

app.listen(8080);
console.log('Server is listening to port 8080');