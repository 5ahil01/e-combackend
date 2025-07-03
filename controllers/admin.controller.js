const Admin = require("../models/admin.model");
const Merchant = require("../models/merchant.model");
const Customer = require("../models/customer.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Email and Password required",
      });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });

    const isMatched = await bcrypt.compare(password, admin.password);
    if (!isMatched)
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });

    const accessToken = jwt.sign(
      { adminId: admin._id },
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
        userId: admin._id,
        name: admin.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.getAllMerchants = async (req, res) => {
  try {
    const search = req.query.name || "";
    const words = search.split(" ");

    const regexConditions = words.map((word) => ({
      name: { $regex: word, $options: "i" },
    }));

    const merchants = await Merchant.find({
      $and: regexConditions,
    });

    if (merchants.length === 0)
      return res.status(404).json({
        success: false,
        message: "No merchants found",
      });

    res.status(200).json({
      success: true,
      message: "Merchants found",
      merchants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.getAllCustomers = async (req, res) => {
  try {
    const search = req.query.name || "";
    const words = search.split(" ");

    const regexConditions = words.map((word) => ({
      name: { $regex: word, $options: "i" },
    }));

    const customers = await Customer.find({
      $and: regexConditions,
    });

    if (customers.length === 0)
      return res.status(404).json({
        success: false,
        message: "No customers found",
      });

    res.status(200).json({
      success: true,
      message: "Customers found",
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findByIdAndDelete(customerId);

    if (!customer)
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.deleteMerchant = async (req, res) => {
  try {
    const merchantId = req.params.id;
    const merchant = await Merchant.findByIdAndDelete(merchantId);

    if (!merchant)
      return res.status(404).json({
        success: false,
        message: "Merchant not found",
      });

    res.status(200).json({
      success: true,
      message: "Merchant deleted successfully",
      data: merchant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
