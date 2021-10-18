import { RequestHandler } from 'express';
import AuthenticationService from '../services/authentication.service';

export default class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  login: RequestHandler = (req, res) => {
    const { username, password } = req.body;

    this.authService.login(username, password).then(
      (accessToken) => {
        res.json({ accessToken });
      },
      (error) => {
        res.status(403).json({ error });
      },
    );
  };
}
