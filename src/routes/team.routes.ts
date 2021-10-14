import express from 'express';
import TeamController from '../controllers/team.controller';
import TeamService from '../services/team.service';

const teamRouter = express.Router();
const teamController = new TeamController(new TeamService());

teamRouter.get('/', teamController.getAllTeams);
teamRouter.get('/:teamId', teamController.getTeamById);
teamRouter.put('/:teamId/sprints', teamController.createSprint);

export default teamRouter;
