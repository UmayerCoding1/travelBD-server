import {asyncHandler} from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import { uploadCloudinary } from '../utils/cloudinary.js';
const generateAccessAndRefreshToken = async (userId) => {
   try {
    
    
     const user = await User.findById(userId);
     
     const accessToken = await user.generateAccessToken();
     const refreshToken = await user.generateRefreshToken();
     
     user.refreshToken = refreshToken;
     await user.save({validateBeforeSave: false});
     return {accessToken,refreshToken}
   } catch (error) {
    console.log(error);
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
   }
    
} 






const registerUser = asyncHandler(async(req,res) => {
    const{fullName,email,password,userName} = req.body;
    
    if([fullName,email,password,userName].some((field) => field?.trim() === "")){
        throw new ApiError(400,"All field are required")
    }

    if(!email) throw new ApiError(400, "Email is required");
    
    if(!email.includes('@')) throw new ApiError(400, "Email is not valid");

    const existingUser = await User.findOne({
        $or:[{userName}, {email}]
    });

    if(existingUser)throw new ApiError(409, "This user already exist");

    const user =await User.create({
        fullName: fullName.toLowerCase(),
        email,
        userName: userName.toLowerCase(),
        password
    });

    const createdUser = await User.findById(user._id).select(
        "-password  -refreshToken"
      );
    console.log(createdUser);
    

    if(!createdUser) throw new ApiError(500, "Something went wrong while registering the user");


   return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "User sign in successfully")
    )
});

const loginUser = asyncHandler(async(req,res) => {
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
        // todo: secure value is hidden for .env file
        secure: process.env.OPTION_SECURE === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
    }

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


})


const logoutUser = asyncHandler(async(req,res) => {
   await User.findByIdAndUpdate(req.user._id,{
    $unset: {
        refreshToken:1
    }
   });

   const option = {
        httpOnly: true,
        secure: process.env.OPTION_SECURE === "production",
        // sameSite: "None",
   }

   
   return res
   .status(200)
   .clearCookie('accessToken', option)
   .clearCookie('refreshToken',option)
   .json(new ApiResponse(200,{},"Logout successfully"))
});

const refreshPage = asyncHandler(async(req,res) => {
    console.log("token",req.cookies);
    
  try {
      const {accessToken} = req.cookies;
      console.log();
      
      
      if(!accessToken){
          throw new ApiError(401, "no token exist")
      }
  
      // verify Token 
      const playLoad = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(playLoad._id).select("-password -refreshToken");
  
      if(!user){
          throw new ApiError(404, "User not found")
      }
  
      return res
      .status(200)
      .json(new ApiResponse(200, user, "User exist"))
      
  } catch (error) {
    console.log(error);
    
    if (error.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Token has expired" });
    } else {
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
  }
    
});

// get user data form logged user 
const loggedUser = asyncHandler(async (req,res) => {
    const email = req.query.email;
  
   const user = await User.find({email});
   
   res
   .status(200)
   .json(
    new ApiResponse(200, user, 'User exist')
   )
});

const updateUserInfo = asyncHandler(async(req,res) => {
    const {fullName,userName,email,gender,marital_status, date_of_Birth, nationalID, religion, emergency_contact} = req.body;
    
    try {
        const updateData = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    fullName,
                    userName,
                    email,
                    gender,
                    marital_status,
                    date_of_Birth,
                    nationalID,
                    religion,
                    emergency_contact
                }
            },{new: true, runValidators:true}
        ).select('-password -refreshToken')

        if (!updateData) {
            throw new ApiError(404, 'User not found')
        }

        res
        .status(200)
        .json(new ApiResponse(200, updateData, 'user data is successfully update'))
    } catch (error) {
        throw new ApiError(404, 'User not found')
    }
    
});

const updateAvatar = asyncHandler(async(req,res) => {
  const avatarImg = req.file.path;
  if (!avatarImg) {
    throw new ApiError(400, 'Avatar image is missing');
  }

  const avatar = await uploadCloudinary(avatarImg);

   const user = await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            avatar: avatar.url
        }
    },{new: true, runValidators: true}
  ).select('-password -refreshToken')
  
console.log(user);

  res
  .status(200)
  .json(
    new ApiResponse(200, user,'Your avatar is successfully update')
  )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshPage,
    loggedUser,
    updateUserInfo,
    updateAvatar
}