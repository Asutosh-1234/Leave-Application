import { ApiResponse } from "../utilities/api-response.js";
import { createUserService, verifyAndLoginUserService } from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userWithoutPassword = await createUserService(name, email, password);
    res.status(201).json(new ApiResponse(201, userWithoutPassword, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { loggedInUser, accessToken, refreshToken } = await verifyAndLoginUserService(email, password);

    res.status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
  } catch (error) {
    next(error);
  }
};