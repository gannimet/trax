import { Request, Response } from 'express';
import Team from '../models/team';
import User from '../models/user';

export default class UserController {
  getUserData = (req: Request, res: Response): void => {
    User.findAll({ include: [Team] }).then(
      (data) => {
        res.send(data);
      },
      (err) => {
        console.log('Error querying:', err);
      },
    );
  };
}
