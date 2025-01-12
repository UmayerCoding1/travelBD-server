import express from 'express';
import { loggedUser, loginUser, logoutUser, refreshPage, registerUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',verifyToken, logoutUser)

router.get('/refresh',verifyToken, refreshPage);
router.get('/user',verifyToken,loggedUser);
export default  router;