import AuthenticationService from '../services/authentication.service';
import { ControllerMethod } from './utils/req-res.utils';

export default class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  login: ControllerMethod = (req, res) => {
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
