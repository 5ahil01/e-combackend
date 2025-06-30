// POST   /api/admin/login
// GET    /api/admin/users                 View all users
// GET    /api/admin/merchants             View all merchants
// DELETE /api/admin/user/:id              Delete a user
// DELETE /api/admin/merchant/:id          Delete a merchant
// GET    /api/admin/reports               View sales or performance reports

const express = require("express");
const adminPublicRoutes = express.Router();
const adminProtectedRoutes = express.Router();
const controller = require("../controllers/admin.controller");

// Public Routes
adminPublicRoutes.post("/login", controller.login);

// Protected Routes
adminProtectedRoutes.get("/merchants", controller.getAllMerchants);

adminProtectedRoutes.get("/customers", controller.getAllCustomers);

adminProtectedRoutes.delete("/customer/:id", controller.deleteCustomer);

adminProtectedRoutes.delete("/merchant/:id", controller.deleteMerchant);

adminProtectedRoutes.get("/users", (req, res) => {
  res.send("View all users");
});

adminProtectedRoutes.get("/reports", (req, res) => {
  res.send("Admin reports");
});

module.exports = {
  adminProtectedRoutes,
  adminPublicRoutes,
};
