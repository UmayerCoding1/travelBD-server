import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from '../utils/ApiError.js';
import { User } from "../models/user.model.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, userName } = req.body;

  if (
    [fullName, email, password, userName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are required");
  }

  if (!email) throw new ApiError(400, "Email is required");

  if (!email.includes("@")) throw new ApiError(400, "Email is not valid");

//   check for existUser 
  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) throw new ApiError(409, "This user already exist");

//   create new user hear
  const user = await User.create({
    fullName: fullName.toLowerCase(),
    email,
    userName: userName.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password  -refreshToken"
  );
  // console.log(createdUser);

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User sign in successfully"));
});

export { registerUser };
