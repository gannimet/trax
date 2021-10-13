import express from 'express';
import UserController from '../controllers/user.controller';
import { authMiddleWare } from '../middleware/auth.middleware';

const userRouter = express.Router();
const userController = new UserController();

userRouter.post('/login', userController.login);
userRouter.get('/', authMiddleWare, userController.getAllUsers);

export default userRouter;
