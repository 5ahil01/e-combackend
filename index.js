const express = require("express");
const customerRoutes = require("./routes/customer.routes");
const adminRoutes = require("./routes/admin.routes");
const merchantRoutes = require("./routes/merchant.routes");

const dbConnect = require("./config/db");

require("dotenv").config();

const auth = require("./middlewares/auth");
const app = express();
const PORT = 3000;

app.use(express.json());

//Public routes
app.use("/api/admin", adminRoutes.adminPublicRoutes);
app.use("/api/customer", customerRoutes.customerPublicRoutes);
app.use("/api/merchant", merchantRoutes.merchantPublicRoutes);

//Protected routes
app.use("/api/admin", auth, adminRoutes.adminProtectedRoutes);
app.use("/api/customer", auth, customerRoutes.customerProtectedRoutes);
app.use("/api/merchant", auth, merchantRoutes.merchantProtectedRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnect();
});
