import prisma from "../utilities/prisma-client.js";
import { ApiError } from "../utilities/api-error.js";
import { ApiResponse } from "../utilities/api-response.js";
import ENV from "../utilities/env.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utilities/async-handler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({where: {id: decodedToken.id},
    select:{
      id: true,
      name: true,
      email: true,
      role: true,

    }})

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});


export const verifyRole = (role) => asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (user.role !== role) {
    throw new ApiError(403, "Not authorized for this request");
  }
  next();
});
