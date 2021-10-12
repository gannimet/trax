import express from 'express';
import UserController from '../controllers/user-controller';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', userController.getUserData);

export default userRouter;
