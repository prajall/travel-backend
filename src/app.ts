import express from "express";
import companyRoutes from "./s-admin/company/company.route.ts";
import userRoutes from "./s-admin/user/user.route.ts";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is working!" });
});

//routes
app.use("/company", companyRoutes);
app.use("/user", userRoutes);

export default app;
