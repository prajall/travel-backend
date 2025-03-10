import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./user.model.ts";
import { apiError, apiResponse } from "../../utils/response.util.ts";

// Generate JWT token
const generateToken = (id: any) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Jwt secret is not available");
  }

  const token = jwt.sign({ id }, secret);
  return token;
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Request body", req.body);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return apiError(res, 404, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return apiError(res, 400, "Incorrect Password");
    }

    const filteredUser = user.toObject() as any;
    delete filteredUser.password;

    const token = generateToken(user._id.toString());

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 2592000000),
      })
      .json({
        success: true,
        message: "User Logged In Successfully",
        user: filteredUser,
      });
    return;
  } catch (error: any) {
    console.error(error);
    return apiError(res, 500, "Internal Server Error", error);
  }
};

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiError(res, 400, "Email is already in use");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    return apiResponse(res, 201, "User registered successfully", {
      id: newUser._id,
      email: newUser.email,
    });
  } catch (error) {
    return apiError(res, 500, "Error registering user", error);
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  const user = req.user;
  console.log("Auth user:", user);
  try {
    if (!user) {
      return apiError(res, 404, "User not found");
    }
    let additionalDetails: any = {};

    const filteredUser = { ...user.toObject(), ...additionalDetails };

    console.log("Filtered user", filteredUser);
    delete filteredUser.createdAt;
    delete filteredUser.updatedAt;
    delete filteredUser.__v;
    delete filteredUser.password;

    return apiResponse(
      res,
      200,
      "User info fetched successfully",
      filteredUser
    );
  } catch (err: any) {
    console.error("Error fetching user info: ", err);
    return res.status(400).json({ message: err.message });
  }
};
