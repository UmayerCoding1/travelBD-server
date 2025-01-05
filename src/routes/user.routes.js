import express from 'express';
import { loggedUser, loginUser, logoutUser, refreshPage, registerUser, updateAvatar, updateUserInfo } from '../controllers/user.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { upload } from './../middlewares/multer.middlewares.js';

const router = express.Router();

// Auth and user related route
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update-avatar', verifyToken, upload.single('avatar'),updateAvatar);
router.get('/user',verifyToken, loggedUser);
router.patch('/update-User-info', verifyToken, updateUserInfo)



// secured route
router.post('/logout', verifyToken, logoutUser);
router.get('/refresh', refreshPage)



export default  router;