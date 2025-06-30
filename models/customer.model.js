const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  // phone: {
  //   type: String,
  //   required: false,
  // },
  // address: {
  //   street: String,
  //   city: String,
  //   state: String,
  //   zip: String,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
