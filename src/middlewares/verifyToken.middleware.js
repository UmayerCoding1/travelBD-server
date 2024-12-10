import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken';

const verifyToken = asyncHandler(async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace('Bearer ', '');
        console.log('verify', token);
        
        if (!token) {
            throw new ApiError(401, "Unauthorized access");
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user;
 
        next();
    } catch (error) {
        console.log(error);
    }
});

export {verifyToken}