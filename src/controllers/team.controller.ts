import TeamService from '../services/team.service';
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
}
