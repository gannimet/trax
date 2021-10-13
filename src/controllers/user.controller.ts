import { Request, Response } from 'express';
import UserService from '../services/user.service';

export default class UserController {
  constructor(private userService: UserService) {}

  getAllUsers = (req: Request, res: Response): void => {
    this.userService.getAllUsers().then(
      (data) => {
        return res.send(data);
      },
      (err) => {
        console.log('Error querying:', err);

        return res.sendStatus(500);
      },
    );
  };

  getUserById = (req: Request, res: Response): void => {
    const { userId } = req.params;

    this.userService.getUserById(userId).then(
      (data) => {
        if (data) {
          return res.send(data);
        }

        return res.sendStatus(404);
      },
      (err) => {
        console.log('Error querying:', err);

        return res.sendStatus(500);
      },
    );
  };
}
