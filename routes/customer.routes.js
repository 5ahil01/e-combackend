// POST   /api/customer/signup
// POST   /api/customer/login
// GET    /api/customer/products          Browse products
// POST   /api/customer/cart              Add to cart
// GET    /api/customer/cart              View cart
// POST   /api/customer/order             Place an order
// GET    /api/customer/orders            View order history

const express = require("express");

const controller = require("../controllers/customer.controller");

const customerPublicRoutes = express.Router();
const customerProtectedRoutes = express.Router();

//Public Routes
customerPublicRoutes.post("/signup", controller.signup);
customerPublicRoutes.post("/login", controller.login);

//Protected Routes
customerProtectedRoutes.get("/products", controller.getProducts);

customerProtectedRoutes.get("/cart", (req, res) => {
  res.send("View cart");
});

customerProtectedRoutes.post("/cart", (req, res) => {
  res.send("Add to cart");
});

customerProtectedRoutes.post("/order", (req, res) => {
  res.send("Order placed");
});

customerProtectedRoutes.get("/orders", (req, res) => {
  res.send("Order history");
});

module.exports = {
  customerProtectedRoutes,
  customerPublicRoutes,
};
