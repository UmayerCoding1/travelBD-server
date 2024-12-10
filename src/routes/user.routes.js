import express from 'express';
import { loginUser, logoutUser, refreshPage, registerUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);



// secured route
router.post('/logout', verifyToken, logoutUser);

router.get('/refresh', refreshPage)



export default  router;