import express from 'express';
import UserController from '../controllers/user.controller';
import UserService from '../services/user.service';

const userRouter = express.Router();
const userController = new UserController(new UserService());

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:userId', userController.getUserById);
userRouter.get('/:userId/teams', userController.getAllTeamsByUser);

export default userRouter;
