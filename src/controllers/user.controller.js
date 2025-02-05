import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Generate access and refresh tokens
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }

    if (typeof user.generateAccessToken !== "function" || typeof user.generateRefreshToken !== "function") {
      throw new ApiError(500, "Token generation methods are missing in User model");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    console.log("Generated Access Token:", accessToken);
    console.log("Generated Refresh Token:", refreshToken);

    // Save refreshToken to the user in DB
    try {
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
    } catch (err) {
      console.error("Error saving refresh token:", err);
      throw new ApiError(500, "Failed to save refresh token");
    }

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateAccessAndRefereshTokens:", error);
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    console.log("Registering User:", { fullName, email, username, password });

    if ([fullName, email, username, password].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    console.log("Cloudinary image data:", req.files);

    const avatarImageLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.cover?.[0]?.path;

    if (!avatarImageLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    console.log("Uploading Avatar to Cloudinary:", avatarImageLocalPath);
    const avatar = await uploadCloudinary(avatarImageLocalPath);
    console.log("Cloudinary Avatar Response:", avatar);

    if (!avatar || !avatar.url) {
      throw new ApiError(400, "Failed to upload avatar");
    }

    let coverImage = null;
    if (coverImageLocalPath) {
      console.log("Uploading Cover Image to Cloudinary:", coverImageLocalPath);
      coverImage = await uploadCloudinary(coverImageLocalPath);
      console.log("Cloudinary Cover Image Response:", coverImage);
    }

    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      username: username.toLowerCase(),
      password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error in user controller",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!(username || email)) {
      throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const passwordValid = await user.isPasswordCorrect(password);
    if (!passwordValid) {
      throw new ApiError(401, "Password is incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookie only in production
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User Logged In Successfully"));
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error in loginUser",
    });
  }
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });

    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.error("Error in logoutUser:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error in logoutUser",
    });
  }
};

export { registerUser, loginUser, logoutUser };
