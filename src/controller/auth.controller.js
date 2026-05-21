import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../utilities/prisma-client.js";
import { ApiError } from "../utilities/api-error.js";
import { ApiResponse } from "../utilities/api-response.js";
import ENV from "../utilities/env.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ENV.ACCESS_TOKEN_SECRET,
      { expiresIn: ENV.ACCESS_TOKEN_EXPIRY }
    );
    
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      ENV.REFRESH_TOKEN_SECRET,
      { expiresIn: ENV.REFRESH_TOKEN_EXPIRY }
    );

    await prisma.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, refresh_token, ...userWithoutPassword } = user;

    res.status(201).json(new ApiResponse(201, userWithoutPassword, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);
    
    const { password: _, refresh_token, ...loggedInUser } = user;

    res.status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
  } catch (error) {
    next(error);
  }
};