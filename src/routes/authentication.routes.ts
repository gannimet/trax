import express from 'express';
import AuthenticationController from '../controllers/authentication.controller';
import AuthenticationService from '../services/authentication.service';

const authRouter = express.Router();
const authController = new AuthenticationController(
  new AuthenticationService(),
);

authRouter.post('/login', authController.login);

export default authRouter;
