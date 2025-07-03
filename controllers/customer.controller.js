const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await Customer.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: {
        id: newCustomer._id,
        name: newCustomer.name,
        email: newCustomer.email,
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

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatched = await bcrypt.compare(password, customer.password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = jwt.sign(
      { customerId: customer._id },
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
        userId: customer._id,
        name: customer.name,
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

module.exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;

    let filter = {};
    let sortOption = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (sort) {
      // -price
      const order = sort.startsWith("-") ? -1 : 1;
      const field = sort.replace("-", "");

      sortOption[field] = order;
      //sortOption object {price : -1}
    }

    //Product.find({category : category }).sort({price : -1})
    const products = await Product.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      message: "Filter options received",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports.viewCart = async (req, res) => {
  try {
    const { customerId } = req.params.id;

    const customer = await Customer.findById(customerId);

    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found !" });

    res.status(200).json({
      message: true,
      message: "Customer cart found",
      cart: customer.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { productId, qty } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $addToSet: {
          "cart.items": {
            productId,
            qty,
          },
        },
        $set: {
          "cart.updatedAt": new Date(),
        },
      },
      { new: true }
    ).populate("cart.items.productId");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: customer.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports.updateCartQty = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productId } = req.params.id;
    const { action } = req.body; // inc or dec

    //search for the customer using customer Id

    const customer = await Customer.findById(customerId);

    const itemToUpdate = customer.cart.find(
      (item) => item.productId == productId
    );

    if (!item)
      return res.status(400).json({
        success: false,
        message: "Item not found in cart",
      });

    if (action == "inc") {
      itemToUpdate.qty += 1;
    }

    if (action == "dec") {
      itemToUpdate.qty -= 1;

      if (itemToUpdate.qty <= 0) {
        customer.cart.items = customer.cart.items.filter(
          (item) => item.productId.toString() === productId
        );
      }
    }

    customer.cart.updateAt = Date.now();
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Item qty successfully updated ",
      cart: customer.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Server error",
      error: error.message,
    });
  }
};
