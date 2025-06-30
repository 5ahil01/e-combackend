const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  qty: Number,
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchant",
  },
});

module.exports = mongoose.model("Product", productSchema);
