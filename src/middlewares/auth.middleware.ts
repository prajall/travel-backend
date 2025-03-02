import { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/response.util.ts";
import jwt from "jsonwebtoken";
import { User } from "../s-admin/user/user.model.ts";

interface JwtPayload {
  id: string;
}
export const authValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    console.log("Token: ", token);

    if (!token) {
      return apiError(res, 401, "Authentication failed. Please Login first");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;

    const user = await User.findById(decoded.id)
      .select("-password")
      .populate({ path: "role", strictPopulate: false });

    if (!user) {
      return apiError(res, 404, "User not found");
    }
    (req as any).user = user;
    next();
  } catch (error: any) {
    return apiError(res, 401, "Invalid or expired token", error.message);
  }
};
