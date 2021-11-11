import { Op } from 'sequelize';
import { HttpErrorString } from '../constants/http-error-string';
import Team from '../models/sequelize/team';
import TeamSprint from '../models/sequelize/team-sprint';
import TeamUser from '../models/sequelize/team-user';
import Ticket from '../models/sequelize/ticket';
import TicketStatus from '../models/sequelize/ticket-status';
import TicketStatusTransition from '../models/sequelize/ticket-status-transition';
import User from '../models/sequelize/user';
import UserRole from '../models/sequelize/user-role';
import { getTicketIncludeOptions } from './utils/query-options';
import {
  createUUID,
  ensureQueryResult,
  ensureUserPermissionByQuery,
} from './utils/query-utils';

export type TeamSprintUpdate = Pick<TeamSprint, 'name' | 'description'>;

const getTeamUserCanEditSprintsPermissionQuery = (
  userId: string,
  teamId: string,
) => {
  return TeamUser.findOne({
    where: {
      userId,
      teamId,
      canEditSprints: true,
    },
  });
};

const getTeamUserCanDeleteSprintsPermissionQuery = (
  userId: string,
  teamId: string,
) => {
  return TeamUser.findOne({
    where: {
      userId,
      teamId,
      canDeleteSprints: true,
    },
  });
};

const getUserCanEditTeamsPermissionQuery = (userId: string) => {
  return User.findOne({
    where: {
      id: userId,
    },
    include: [
      {
        model: UserRole,
        required: true,
        where: {
          canEditTeams: true,
        },
      },
    ],
  });
};

export default class TeamService {
  getTeamDetailsForUser(
    userId: string,
    teamId: string,
  ): Promise<TeamUser | null> {
    return TeamUser.findOne({
      where: {
        userId,
        teamId,
      },
      include: [
        {
          model: Team,
          include: [
            {
              model: TeamSprint,
              include: [
                {
                  model: Ticket,
                  ...getTicketIncludeOptions(),
                },
              ],
            },
            {
              model: User,
            },
          ],
        },
      ],
    });
  }

  getAllTeamsByUser(userId: string): Promise<TeamUser[]> {
    return TeamUser.findAll({
      include: [Team],
      where: {
        userId,
      },
      attributes: {
        exclude: ['teamId', 'userId', 'id'],
      },
    });
  }

  createTeam(
    userId: string,
    name: string,
    description?: string,
  ): Promise<Team> {
    return ensureUserPermissionByQuery(
      getUserCanEditTeamsPermissionQuery(userId),
    ).then(() => {
      return ensureQueryResult(
        TicketStatus.findOne({
          attributes: ['id'],
          where: {
            name: 'Open',
          },
        }),
        {
          statusCode: 500,
          errorMessage: HttpErrorString.INVALID_STATE,
        },
      ).then(({ id: initialTicketStatusId }) => {
        const id = createUUID();

        return Team.create({
          id,
          name,
          description,
          initialTicketStatusId,
        });
      });
    });
  }

  createSprint(
    teamId: string,
    userId: string,
    name: string,
    description?: string,
  ): Promise<TeamSprint> {
    return ensureUserPermissionByQuery(
      getTeamUserCanEditSprintsPermissionQuery(userId, teamId),
    ).then(() => {
      const id = createUUID();

      return TeamSprint.create({
        id,
        teamId,
        name,
        description,
        active: false,
      });
    });
  }

  deleteSprint(
    teamId: string,
    sprintId: string,
    userId: string,
  ): Promise<number> {
    return ensureUserPermissionByQuery(
      getTeamUserCanDeleteSprintsPermissionQuery(userId, teamId),
    ).then(() => {
      return TeamSprint.destroy({
        where: {
          id: sprintId,
        },
      });
    });
  }

  editSprint(
    teamId: string,
    sprintId: string,
    userId: string,
    updateObject: TeamSprintUpdate,
  ): Promise<[number, TeamSprint[]]> {
    return ensureUserPermissionByQuery(
      getTeamUserCanEditSprintsPermissionQuery(userId, teamId),
    ).then(() => {
      return TeamSprint.update(updateObject, {
        where: { id: sprintId },
      });
    });
  }

  activateSprint(
    teamId: string,
    sprintId: string,
    userId: string,
  ): Promise<[number, TeamSprint[]]> {
    return ensureUserPermissionByQuery(
      getTeamUserCanEditSprintsPermissionQuery(userId, teamId),
    ).then(() => {
      return TeamSprint.update(
        { active: true },
        { where: { id: sprintId } },
      ).then(() => {
        return TeamSprint.update(
          { active: false },
          { where: { id: { [Op.not]: sprintId } } },
        );
      });
    });
  }

  getStatusTransitionInfo(teamId: string): Promise<TicketStatus[]> {
    return TicketStatus.findAll({
      where: {
        teamId: {
          [Op.or]: [teamId, null],
        },
      },
      include: [
        {
          model: TicketStatusTransition,
          foreignKey: 'previousStatusId',
          as: 'transitionsFrom',
          attributes: { exclude: ['previousStatusId', 'nextStatusId'] },
          include: [
            {
              model: TicketStatus,
              foreignKey: 'nextStatusId',
              as: 'nextStatus',
            },
          ],
        },
        {
          model: TicketStatusTransition,
          foreignKey: 'nextStatusId',
          as: 'transitionsTo',
          attributes: { exclude: ['previousStatusId', 'nextStatusId'] },
          include: [
            {
              model: TicketStatus,
              foreignKey: 'previousStatusId',
              as: 'previousStatus',
            },
          ],
        },
      ],
    });
  }
}
