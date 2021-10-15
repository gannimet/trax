import { v4 as uuidv4 } from 'uuid';
import { HttpErrorString } from '../controllers/constants/http-error-string';
import { HttpErrorMessage } from '../controllers/models/http-error-message';
import Team from '../models/team';
import TeamSprint from '../models/team-sprint';
import TeamUser from '../models/team-user';

export type TeamSprintUpdate = Pick<TeamSprint, 'name' | 'description'>;

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
    return TeamUser.findOne({
      where: {
        userId,
        teamId,
        canEditSprints: true,
      },
    }).then(
      (teamUser) => {
        if (teamUser) {
          const id = uuidv4();

          return TeamSprint.create({
            id,
            teamId,
            name,
            description,
            active: false,
          });
        }

        return Promise.reject({
          statusCode: 403,
          errorMessage: HttpErrorString.MISSING_RIGHTS,
        } as HttpErrorMessage);
      },
      (teamUserErr) => {
        return Promise.reject(teamUserErr);
      },
    );
  }

  deleteSprint(
    teamId: string,
    sprintId: string,
    userId: string,
  ): Promise<number> {
    return TeamUser.findOne({
      where: {
        userId,
        teamId,
        canDeleteSprints: true,
      },
    }).then(
      (teamUser) => {
        if (teamUser) {
          return TeamSprint.destroy({
            where: {
              id: sprintId,
            },
          });
        }

        return Promise.reject({
          statusCode: 403,
          errorMessage: HttpErrorString.MISSING_RIGHTS,
        } as HttpErrorMessage);
      },
      (teamUserErr) => {
        return Promise.reject(teamUserErr);
      },
    );
  }

  editSprint(
    teamId: string,
    sprintId: string,
    userId: string,
    updateObject: TeamSprintUpdate,
  ): Promise<[number, TeamSprint[]]> {
    return TeamUser.findOne({
      where: {
        userId,
        teamId,
        canEditSprints: true,
      },
    }).then(
      (teamUser) => {
        if (teamUser) {
          return TeamSprint.update(updateObject, {
            where: { id: sprintId },
          });
        }

        return Promise.reject({
          statusCode: 403,
          errorMessage: HttpErrorString.MISSING_RIGHTS,
        } as HttpErrorMessage);
      },
      (teamUserErr) => {
        return Promise.reject(teamUserErr);
      },
    );
  }
}
