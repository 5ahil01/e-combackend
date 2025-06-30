const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect("mongodb://localhost:27017/ecomDB")
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => console.log(err));
};
