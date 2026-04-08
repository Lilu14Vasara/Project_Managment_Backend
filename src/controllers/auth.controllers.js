import { User } from "../models/User.js";
import  ApiResponse  from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    const user = await User.create({
      email,
      password,
      username,
      isEmailVerified: false,
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await user.save({ validateBeforeSave: false });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: false,
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(201, createdUser, "User registered successfully")
      );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!(email || username)) {
      throw new ApiError(400, "Email or Username is required");
    }

    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: false,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, loggedInUser, "User logged in successfully")
      );
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: false,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    next(error);
  }
};
//http://localhost:3000/api/v1/projects/69d6285f000350ef7e1bc137/tasks