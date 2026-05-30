const validator = require("../helpers/validate");

const saveBook = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    authorName: "required|string",
    genre: "required|string",
    pageCount: "required|integer",
    price: "required|numeric",
    publisher: "required|string",
    publicationDate: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

const saveUser = (req, res, next) => {
  const validationRule = {
    name: "required|string",
    checkedOut: "required|integer",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = { saveBook, saveUser };
