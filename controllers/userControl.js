const { response } = require("express");
const mongodb = require("../dataBase/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb();
    const lists = await db.collection("users").find().toArray();
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(lists);
  } catch (err) {
    return res.status(500).json({ message: err.message || err });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json("Must use a valid user id to find a user.");
    }
    const db = mongodb.getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
      return res.status(404).json("User not found.");
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message || err });
  }
};

const createUser = async (req, res) => {
  const user = {
    name: req.body.name,
    checkedOut: req.body.checkedOut,
  };
  const result = await mongodb.getDb().collection("users").insertOne(user);
  if (result.acknowledged) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || "Some error occurred while creating the book.");
  }
};

const updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid user id to update a user.");
  }
  const id = new ObjectId(req.params.id);
  const user = {
    name: req.body.name,
    checkedOut: req.body.checkedOut,
  };
  const result = await mongodb
    .getDb()
    .collection("users")
    .updateOne({ _id: id }, { $set: user });
  if (result.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || "Some error occurred while updating the user.");
  }
};

const deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid user id to delete a user.");
  }
  const id = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection("users")
    .deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(result.error || "Some error occurred while deleting the user.");
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
