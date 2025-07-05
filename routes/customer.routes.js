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

customerProtectedRoutes.get("/cart", controller.viewCart);

customerProtectedRoutes.post("/cart", controller.addToCart);

customerProtectedRoutes.delete("/cart", (req, re) => {
  res.json({ msg: "Deleted product" });
});

customerProtectedRoutes.put("/updatecartqty", controller.updateCartQty);

customerProtectedRoutes.post("/order", controller.placeOrder);

customerProtectedRoutes.get("/orders", controller.viewOrder);

module.exports = {
  customerProtectedRoutes,
  customerPublicRoutes,
};
