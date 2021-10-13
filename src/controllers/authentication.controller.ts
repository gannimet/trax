import { Request, Response } from 'express';
import AuthenticationService from '../services/authentication.service';

export default class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  login = (req: Request, res: Response): void => {
    const { username, password } = req.body;

    this.authService.login(username, password).then(
      (accessToken) => {
        res.send({ accessToken });
      },
      (error) => {
        res.status(403).send({ error });
      },
    );
  };
}
