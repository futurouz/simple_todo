var data = [{ task: 'read a book' }, { task: 'pratice english' }, { task: 'coding everyday' }];

module.exports = function (app) {
    app.get('/todo', function (req, res) {
        res.render('todo', { todo: data });
    });
    app.post('/todo', function (req, res) {

    });
    app.delete('/todo/:item', function (req, res) {

    });
};