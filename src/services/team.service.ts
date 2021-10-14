import { v4 as uuidv4 } from 'uuid';
import Team from '../models/team';
import TeamSprint from '../models/team-sprint';

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
    name: string,
    description?: string,
  ): Promise<TeamSprint> {
    const id = uuidv4();

    return TeamSprint.create({
      id,
      teamId,
      name,
      description,
      active: false,
      sortIndex: 0,
    });
  }
}
