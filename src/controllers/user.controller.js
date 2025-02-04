import { ApiError } from "../utils/apiError.js";
import {User} from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    console.log("email:", email);
    //one by one error handle
    // if(fullName === ""){
    //     throw new ApiError(400,"fullname is required")
    // }
    // all error handle together
    if (
      [fullName, email, username, password].some((field) => {
        field?.trim() === "";
      })
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    const avatarImageLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarImageLocalPath) {
        throw new ApiError(400,"avatar file is required")
    }

  const avatar = await uploadCloudinary(avatarImageLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }
  const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    email,
    username:username.toLowerCase(),
    password,
  })
  // jo jo field nhi chahey
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new ApiError(500,"Something went wrong while registering the user")
  }
return res.status(201).json(
    new ApiResponse(200,createdUser,"User created Successfully")
)
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { registerUser };
