import {asyncHandler}  from '../utils/AsyncHandler.js';
const registerUser = asyncHandler(async(req,res) => {
  console.log(req.body);
  
})

export {
    registerUser
}