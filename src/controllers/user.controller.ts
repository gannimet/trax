import { Request, Response } from 'express';
import UserService from '../services/user.service';

export default class UserController {
  userService = new UserService();

  login = (req: Request, res: Response): void => {
    const { username, password } = req.body;

    this.userService.login(username, password).then(
      (accessToken) => {
        res.send({ accessToken });
      },
      (error) => {
        res.status(403).send({ error });
      },
    );
  };

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
