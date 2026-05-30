const routes = require('express').Router();
const bookControl = require('../controllers/bookControl');
const userControl = require('../controllers/userControl');
const validation = require('../middleware/validate');

routes.get('/', bookControl.getData);

routes.get('/books', bookControl.getAll);

routes.get('/books/:id', bookControl.getSingle);

routes.post('/books', validation.saveBook, bookControl.createBook);

routes.put('/books/:id', validation.saveBook, bookControl.updateBook);

routes.delete('/books/:id', bookControl.deleteBook);

routes.get('/users', userControl.getAll);

routes.get('/users/:id', userControl.getSingle);

routes.post('/users', validation.saveUser, userControl.createUser);

routes.put('/users/:id', validation.saveUser, userControl.updateUser);

routes.delete('/users/:id', userControl.deleteUser);

module.exports = routes;