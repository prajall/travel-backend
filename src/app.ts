import express from "express";
import companyRoutes from "./s-admin/company/company.route.ts";
import userRoutes from "./s-admin/user/user.route.ts";
import pricingRoutes from "./s-admin/pricing/pricing.route.ts";
import {
  authValidation,
  superAdminValidation,
} from "./middlewares/auth.middleware.ts";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is working!" });
});

//routes
app.use("/company", authValidation, superAdminValidation, companyRoutes);
app.use("/user", authValidation, superAdminValidation, userRoutes);
app.use("/pricing", authValidation, superAdminValidation, pricingRoutes);

export default app;
