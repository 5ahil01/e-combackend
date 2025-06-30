const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
  // businessName: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  // phone: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  // gstNumber: {
  //   type: String,
  //   required: false,
  //   trim: true,
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

const Merchant = mongoose.model("Merchant", merchantSchema);

module.exports = Merchant;
