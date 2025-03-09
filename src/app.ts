import express from "express";
import companyRoutes from "./s-admin/company/company.route.ts";
import userRoutes from "./s-admin/user/user.route.ts";
import planRoutes from "./s-admin/plan/plan.route.ts";
import moduleRoutes from "./s-admin/module/module.route.ts";
import companyPlanRoutes from "./s-admin/company-plan/company-plan.route.ts";

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

//s-admin routes
app.use("/s-admin/company", companyRoutes);
app.use("/s-admin/user", userRoutes);
app.use("/s-admin/plan", planRoutes);
app.use("/s-admin/module", moduleRoutes);
app.use("/s-admin/company-plan", companyPlanRoutes);

export default app;
