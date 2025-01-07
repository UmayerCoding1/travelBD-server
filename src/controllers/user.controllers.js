import {asyncHandler}  from '../utils/AsyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js'
const registerUser = asyncHandler(async(req,res) => {
  console.log(req.body);
  
  res.status(200).json(
    new ApiResponse(200,req.body,'A new user is create')
  )
})

export {
    registerUser
}