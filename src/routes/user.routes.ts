import express from 'express';
import UserController from '../controllers/user.controller';

const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:userId', userController.getUserById);

export default userRouter;
