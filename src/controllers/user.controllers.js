import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
    const {email,password} = req.body;
    
    
    if(!email) {
        throw new ApiError(400, 'Email is required');
    }

    const user = await User.findOne({
        $or: [{ email }]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isCurrentPassword = await user.isPasswordCorrect(password);
    if (!isCurrentPassword) {
        throw new ApiError(401,"Invalid user credential")
    }

    const {accessToken,refreshToken} =await generateAccessAndRefreshToken(user._id);
    
    if (!accessToken && !refreshToken) {
        throw new ApiError(500, "Something went wrong  not find refresh ans access token")
    }

    const loggedUser = await User.findById(user._id).select("-password -refreshToken");

    const option ={
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite:  "None",
      domain: process.env.NODE_ENV === "production" ? "travelbd-t5kb.onrender.com" : "localhost",
    }
console.log(option);
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken,option)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedUser,
                accessToken,
                refreshToken
            },
            "user login successfully"
        )
    )
});

export { registerUser, loginUser };
