const routes = require('express').Router();
const baseControl = require('../controllers/baseControl');
const validation = require('../middleware/validate');

routes.get('/', bookControl.getData);

routes.get('/books', bookControl.getAll);

routes.get('/books/:id', bookControl.getSingle);

routes.post('/books', validation.saveBook, bookControl.createBook);

routes.put('/books/:id', validation.saveBook, bookControl.updateBook);

routes.delete('/books/:id', bookControl.deleteBook);

module.exports = routes;