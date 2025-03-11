import express, { Request, Response } from "express";
import { authValidation } from "../../middlewares/auth.middleware.ts";
import { getUserInfo, loginUser, signupUser } from "./user.controller.ts";

const router = express.Router();

router.post("/login", loginUser);
router.get("/info", authValidation, (req: Request, res: Response) => {
  getUserInfo(req, res);
});
// router.post("/signup", signupUser);

// router.post("/login", login);

export default router;
