// POST   /api/merchant/signup
// POST   /api/merchant/login
// POST   /api/merchant/products          Add new product
// PUT    /api/merchant/products/:id      Edit product
// DELETE /api/merchant/products/:id      Delete product
// GET    /api/merchant/orders            View orders for their products

const express = require("express");
const controller = require("../controllers/merchant.controller");

const merchantPublicRoutes = express.Router();
const merchantProtectedRoutes = express.Router();

// Public Routes
merchantPublicRoutes.post("/signup", controller.signup);

merchantPublicRoutes.post("/login", controller.login);

//  Protected Routes
merchantProtectedRoutes.post("/addproduct/:id", controller.addProduct);

merchantProtectedRoutes.put("/products/:id", controller.editProduct);

merchantProtectedRoutes.delete("/products/:id", controller.deleteProduct);

merchantProtectedRoutes.get("/orders", controller.viewOrders);

module.exports = {
  merchantPublicRoutes,
  merchantProtectedRoutes,
};
