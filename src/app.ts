import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import companyRoutes from "./s-admin/company/company.route.ts";
import userRoutes from "./s-admin/user/user.route.ts";
import planRoutes from "./s-admin/plan/plan.route.ts";
import moduleRoutes from "./s-admin/module/module.route.ts";
import companyPlanRoutes from "./s-admin/company-plan/company-plan.route.ts";
import blogRoutes from "./s-admin/blog/blog.route.ts";
import blogCategoryRoutes from "./s-admin/blog-category/blog-category.route.ts";

import companyUrlRoutes from "./s-admin/company-url/company-url.route.ts";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://kinniko.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is working!" });
});

//s-admin routes
app.use("/s-admin/company", companyRoutes);
app.use("/s-admin/user", userRoutes);
app.use("/s-admin/plan", planRoutes);
app.use("/s-admin/module", moduleRoutes);
app.use("/s-admin/company-plan", companyPlanRoutes);
app.use("/s-admin/company-url", companyUrlRoutes);
app.use("/s-admin/blog", blogRoutes);
app.use("/s-admin/blog-category", blogCategoryRoutes);

export default app;
