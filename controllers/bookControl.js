const { response } = require('express');
const mongodb = require('../dataBase/connect');
const ObjectId = require('mongodb').ObjectId;

const getData = (req, res) => {
 mongodb.getDb().db().collection('books').find()
  .toArray((err, lists) => {
    if (err) {
      res.status(400).json({ message: err });
    }
  
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists); // we just need the first one (the only one)
  });
};

const getAll = (req, res) => {
 mongodb.getDb().db().collection('books').find()
  .toArray((err, lists) => {
    if (err) {
      res.status(400).json({ message: err });
    }
  
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists); // we just need the first one (the only one)
  });
};

const getSingle = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid book id to find a book.');
    }
    const id = new ObjectId(req.params.id);
    mongodb.getDb().db().collection('books').find({ _id: id })
      .toArray((err, lists) => {
    if (err) {
      res.status(400).json({ message: err });
    }
  
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]); // we just need the first one (the only one)
  });
};

const createBook = async (req, res) => {
    const book = {
        name: req.body.name,
        authorName: req.body.authorName,
        genre: req.body.genre,
        pageCount: req.body.pageCount,
        price: req.body.price,
        publisher: req.body.publisher,
        publicationDate: req.body.publicationDate
    };
    const result = await mongodb.getDb().db().collection('books').insertOne(book);
    if (result.acknowledged) {
        res.status(204).send();
    } else {        res.status(500).json(result.error || 'Some error occurred while creating the book.');
    }
};

const updateBook = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid book id to update a book.');
    }
    const id = new ObjectId(req.params.id);
    const book = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const result = await mongodb.getDb().db().collection('books').updateOne({ _id: id }, { $set: book });
    if (result.modifiedCount > 0) {
        res.status(204).send();
    } else {        res.status(500).json(result.error || 'Some error occurred while updating the book.');
    }
};

const deleteBook = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid book id to delete a book.');
    }
    const id = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('books').deleteOne({ _id: id });
    if (result.deletedCount > 0) {
        res.status(204).send();
    } else {        res.status(500).json(result.error || 'Some error occurred while deleting the book.');
    }
};

module.exports = { getData, getAll, getSingle, createBook, updateBook, deleteBook };