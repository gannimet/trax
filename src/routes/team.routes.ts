import express from 'express';
import TeamController from '../controllers/team.controller';
import TeamService from '../services/team.service';

const teamRouter = express.Router();
const teamController = new TeamController(new TeamService());

// Teams
teamRouter.get('/', teamController.getAllTeamsByUser);
teamRouter.get('/:teamId', teamController.getTeamDetailsForUser);
teamRouter.post('/', teamController.createTeam);

// Sprints
teamRouter.post('/:teamId/sprints', teamController.createSprint);
teamRouter.delete('/:teamId/sprints/:sprintId', teamController.deleteSprint);
teamRouter.put('/:teamId/sprints/:sprintId', teamController.editSprint);
teamRouter.put(
  '/:teamId/sprints/:sprintId/activate',
  teamController.activateSprint,
);

// Misc
teamRouter.get('/:teamId/statusinfo', teamController.getStatusTransitionInfo);

export default teamRouter;
