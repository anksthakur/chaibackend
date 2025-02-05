import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    console.log(" Registering User:", { fullName, email, username, password });

    if ([fullName, email, username, password].some((field) => !field?.trim())) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }
    console.log("cloudinary image data : ", req.files);

    const avatarImageLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarImageLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    console.log(" Uploading Avatar to Cloudinary:", avatarImageLocalPath);
    const avatar = await uploadCloudinary(avatarImageLocalPath);
    console.log(" Cloudinary Avatar Response:", avatar);

    if (!avatar || !avatar.url) {
      throw new ApiError(400, "Failed to upload avatar");
    }

    let coverImage = null;

    if (coverImageLocalPath) {
      console.log(" Uploading Cover Image to Cloudinary:", coverImageLocalPath);
      coverImage = await uploadCloudinary(coverImageLocalPath);
      console.log(" Cloudinary Cover Image Response:", coverImage);
    }

    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      username: username.toLowerCase(),
      password,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User created successfully"));
  } catch (error) {
    console.error(" Error in registerUser:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error in user controller",
    });
  }
};

export { registerUser };
