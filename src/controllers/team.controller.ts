import TeamService from '../services/team.service';
import {
  ControllerMethod,
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

    this.teamService
      .createSprint(teamId, name, description)
      .then(sendDataResponse(res, 201), sendErrorResponse(res));
  };
}
