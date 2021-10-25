import { RequestHandler } from 'express';
import UserService from '../services/user.service';
import {
  sendDataResponse,
  sendDataResponseWith404Option,
  sendErrorResponse,
} from './utils/req-res.utils';

export default class UserController {
  constructor(private userService: UserService) {}

  getAllUsers: RequestHandler = (req, res) => {
    this.userService
      .getAllUsers()
      .then(sendDataResponse(res), sendErrorResponse(res));
  };

  getUserById: RequestHandler = (req, res) => {
    const { userId } = req.params;

    this.userService
      .getUserById(userId)
      .then(sendDataResponseWith404Option(res), sendErrorResponse(res));
  };

  getAllTeamsByUser: RequestHandler = (req, res) => {
    const { userId } = req.params;

    this.userService
      .getAllTeamsByUser(userId)
      .then(sendDataResponse(res), sendErrorResponse(res));
  };

  getTeamDetailsForUser: RequestHandler = (req, res) => {
    const { userId, teamId } = req.params;

    this.userService
      .getTeamDetailsForUser(userId, teamId)
      .then(sendDataResponseWith404Option(res), sendErrorResponse(res));
  };
}
