import { RequestHandler } from 'express';
import TeamService from '../services/team.service';
import {
  getVerifiedUserToken,
  sendDataResponse,
  sendDataResponseWith404Option,
  sendDeleteResponse,
  sendErrorResponse,
} from './utils/req-res.utils';

export default class TeamController {
  constructor(private teamService: TeamService) {}

  getAllTeams: RequestHandler = (req, res) => {
    this.teamService
      .getAllTeams()
      .then(sendDataResponse(res), sendErrorResponse(res));
  };

  getTeamById: RequestHandler = (req, res) => {
    const { teamId } = req.params;

    this.teamService
      .getTeamById(teamId, true)
      .then(sendDataResponseWith404Option(res), sendErrorResponse(res));
  };

  createSprint: RequestHandler = (req, res) => {
    const { name, description } = req.body;
    const { teamId } = req.params;

    getVerifiedUserToken(req).then((user) => {
      this.teamService
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .createSprint(teamId, user.id!, name, description)
        .then(sendDataResponse(res, 201), sendErrorResponse(res));
    }, sendErrorResponse(res));
  };

  deleteSprint: RequestHandler = (req, res) => {
    const { teamId, sprintId } = req.params;

    getVerifiedUserToken(req).then((user) => {
      this.teamService
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .deleteSprint(teamId, sprintId, user.id!)
        .then(sendDeleteResponse(res), sendErrorResponse(res));
    }, sendErrorResponse(res));
  };
}
