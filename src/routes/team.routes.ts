import express from 'express';
import TeamController from '../controllers/team.controller';
import TeamService from '../services/team.service';

const teamRouter = express.Router();
const teamController = new TeamController(new TeamService());

// Teams
teamRouter.get('/', teamController.getAllTeams);
teamRouter.get('/:teamId', teamController.getTeamById);
teamRouter.post('/', teamController.createTeam);

// Sprints
teamRouter.post('/:teamId/sprints', teamController.createSprint);
teamRouter.delete('/:teamId/sprints/:sprintId', teamController.deleteSprint);
teamRouter.put('/:teamId/sprints/:sprintId', teamController.editSprint);
teamRouter.put(
  '/:teamId/sprints/:sprintId/activate',
  teamController.activateSprint,
);

export default teamRouter;
