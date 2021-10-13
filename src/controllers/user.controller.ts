import { Request, Response } from 'express';
import UserService from '../services/user.service';

export default class UserController {
  userService = new UserService();

  getAllUsers = (req: Request, res: Response): void => {
    this.userService.getAllUsers().then(
      (data) => {
        res.send(data);
      },
      (err) => {
        console.log('Error querying:', err);
      },
    );
  };
}
