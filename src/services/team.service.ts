import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Team from '../models/sequelize/team';
import TeamSprint from '../models/sequelize/team-sprint';
import TeamUser from '../models/sequelize/team-user';
import { ensureUserPermissionByQuery } from './utils/query-utils';

export type TeamSprintUpdate = Pick<TeamSprint, 'name' | 'description'>;

const getTeamUserEditPermissionQuery = (userId: string, teamId: string) => {
  return TeamUser.findOne({
    where: {
      userId,
      teamId,
      canEditSprints: true,
    },
  });
};

const getTeamUserDeletePermissionQuery = (userId: string, teamId: string) => {
  return TeamUser.findOne({
    where: {
      userId,
      teamId,
      canDeleteSprints: true,
    },
  });
};

export default class TeamService {
  getAllTeams(): Promise<Team[]> {
    return Team.findAll();
  }

  getTeamById(id: string, includeSprints = false): Promise<Team | null> {
    const inclusions = [];

    if (includeSprints) {
      inclusions.push(TeamSprint);
    }

    return Team.findByPk(id, { include: inclusions });
  }

  createSprint(
    teamId: string,
    userId: string,
    name: string,
    description?: string,
  ): Promise<TeamSprint> {
    return ensureUserPermissionByQuery(
      getTeamUserEditPermissionQuery(userId, teamId),
    ).then(() => {
      const id = uuidv4();

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
      getTeamUserDeletePermissionQuery(userId, teamId),
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
      getTeamUserEditPermissionQuery(userId, teamId),
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
      getTeamUserEditPermissionQuery(userId, teamId),
    ).then(() => {
      return TeamSprint.update(
        { active: true },
        { where: { id: sprintId } },
      ).then(
        () => {
          return TeamSprint.update(
            { active: false },
            { where: { id: { [Op.not]: sprintId } } },
          );
        },
        (firstUpdateError) => Promise.reject(firstUpdateError),
      );
    });
  }
}
