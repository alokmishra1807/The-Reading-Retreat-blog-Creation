import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram: string;
  linkedin: string;
  bio: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please login",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Check if token exists and is not empty
    if (!token || token.trim() === "") {
      res.status(401).json({
        message: "Please login - No token provided",
      });
      return;
    }

    const decodedValue = jwt.verify(
      token,
      process.env.JWT_SEC as string
    ) as JwtPayload;

    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({
        message: "Please login-Invalid token ",
      });
      return;
    }

    req.user = decodedValue.user;
    next();
  } catch (error) {
    console.log("JWT token error :", error);
    res.status(401).json({
      message: "Please login-Jwt error",
    });
  }
};
