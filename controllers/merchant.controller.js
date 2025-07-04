const Merchant = require("../models/merchant.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  try {
    const { ownerName, email, password } = req.body;

    if (!ownerName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await Merchant.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMerchant = await Merchant.create({
      ownerName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Merchant registered successfully",
      data: {
        id: newMerchant._id,
        ownerName: newMerchant.ownerName,
        email: newMerchant.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const isMatched = await bcrypt.compare(password, merchant.password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const accessToken = jwt.sign(
      { merchantId: merchant._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: accessToken,
        merchantId: merchant._id,
        ownerName: merchant.ownerName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.addProduct = async (req, res) => {
  try {
    const { id: merchantId } = req.params;
    const { name, price, qty } = req.body;

    if (!name || price == null || qty == null || !merchantId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (isNaN(price) || isNaN(qty)) {
      return res.status(400).json({
        success: false,
        message: "Price and quantity must be numbers",
      });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
      qty: Number(qty),
      merchantId,
    });

    res.status(200).json({
      success: true,
      message: "Successfully added product",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, qty } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (price != null) updatedData.price = Number(price);
    if (qty != null) updatedData.qty = Number(qty);

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Updated product successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted product successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.viewOrders = async (req, res) => {
  try {
    const { id: merchantId } = req.params;

    //1. All merchant's product exists in products model
    const products = await Product.find({ merchantId });
    const productIds = products.map((product) => product._id);
    const orders = await Order.find({ "items.productId": { $in: productIds } });

    res.status(200).json({
      success: true,
      message: "Orders found successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
