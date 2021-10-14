import TeamService from '../services/team.service';
import { HttpErrorString } from './constants/http-error-string';
import {
  ControllerMethod,
  getVerifiedUserToken,
  sendDataResponse,
  sendDataResponseWith404Option,
  sendErrorResponse,
} from './utils/req-res.utils';

export default class TeamController {
  constructor(private teamService: TeamService) {}

  getAllTeams: ControllerMethod = (req, res) => {
    this.teamService
      .getAllTeams()
      .then(sendDataResponse(res), sendErrorResponse(res));
  };

  getTeamById: ControllerMethod = (req, res) => {
    const { teamId } = req.params;

    this.teamService
      .getTeamById(teamId, true)
      .then(sendDataResponseWith404Option(res), sendErrorResponse(res));
  };

  createSprint: ControllerMethod = (req, res) => {
    const { name, description } = req.body;
    const { teamId } = req.params;

    getVerifiedUserToken(req).then((user) => {
      this.teamService
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .createSprint(teamId, user.id!, name, description)
        .then(sendDataResponse(res, 201), sendErrorResponse(res));
    }, sendErrorResponse(res));
  };

  deleteSprint: ControllerMethod = (req, res) => {
    const { teamId, sprintId } = req.params;

    getVerifiedUserToken(req).then((user) => {
      this.teamService
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .deleteSprint(teamId, sprintId, user.id!)
        .then((count) => {
          if (count === 1) {
            return res.sendStatus(204);
          }

          if (count < 1) {
            return res.status(404).send({
              error: HttpErrorString.RESOURCE_NOT_FOUND,
            });
          }

          return res.status(500).send({
            error: HttpErrorString.AMBIGIOUS_REQUEST,
          });
        }, sendErrorResponse(res));
    }, sendErrorResponse(res));
  };
}
