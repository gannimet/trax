import { RequestHandler } from 'express';
import TeamService, { TeamSprintUpdate } from '../services/team.service';
import {
  sendDataResponse,
  sendDataResponseWith404Option,
  sendDeleteResponse,
  sendErrorResponse,
} from './utils/req-res.utils';

export default class TeamController {
  constructor(private teamService: TeamService) {}

  getAllTeamsByUser: RequestHandler = (req, res) => {
    const { authenticatedUser } = res.locals;

    this.teamService
      .getAllTeamsByUser(authenticatedUser.id)
      .then(sendDataResponse(res), sendErrorResponse(res));
  };

  getTeamDetailsForUser: RequestHandler = (req, res) => {
    const { teamId } = req.params;
    const { authenticatedUser } = res.locals;

    this.teamService
      .getTeamDetailsForUser(authenticatedUser.id, teamId)
      .then(sendDataResponseWith404Option(res), sendErrorResponse(res));
  };

  createTeam: RequestHandler = (req, res) => {
    const { name, description } = req.body;
    const { authenticatedUser } = res.locals;

    this.teamService
      .createTeam(authenticatedUser.id, name, description)
      .then(sendDataResponse(res, 201), sendErrorResponse(res));
  };

  createSprint: RequestHandler = (req, res) => {
    const { name, description } = req.body;
    const { teamId } = req.params;
    const { authenticatedUser } = res.locals;

    this.teamService
      .createSprint(teamId, authenticatedUser.id, name, description)
      .then(sendDataResponse(res, 201), sendErrorResponse(res));
  };

  deleteSprint: RequestHandler = (req, res) => {
    const { teamId, sprintId } = req.params;
    const { authenticatedUser } = res.locals;

    this.teamService
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .deleteSprint(teamId, sprintId, authenticatedUser.id)
      .then(sendDeleteResponse(res), sendErrorResponse(res));
  };

  editSprint: RequestHandler = (req, res) => {
    const { teamId, sprintId } = req.params;
    const { name, description } = req.body;
    const { authenticatedUser } = res.locals;
    const updateObject: TeamSprintUpdate = {};

    if (name != null) {
      updateObject.name = name;
    }

    if (description != null) {
      updateObject.description = description;
    }

    this.teamService
      .editSprint(teamId, sprintId, authenticatedUser.id, updateObject)
      .then(() => res.sendStatus(204), sendErrorResponse(res));
  };

  activateSprint: RequestHandler = (req, res) => {
    const { teamId, sprintId } = req.params;
    const { authenticatedUser } = res.locals;

    this.teamService
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .activateSprint(teamId, sprintId, authenticatedUser.id)
      .then(() => res.sendStatus(204), sendErrorResponse(res));
  };

  getStatusTransitionInfo: RequestHandler = (req, res) => {
    const { teamId } = req.params;

    this.teamService
      .getStatusTransitionInfo(teamId)
      .then(sendDataResponse(res), sendErrorResponse(res));
  };
}
