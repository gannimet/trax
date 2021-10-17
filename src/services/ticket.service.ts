import TeamSprint from '../models/sequelize/team-sprint';
import Ticket from '../models/sequelize/ticket';
import TicketStatus from '../models/sequelize/ticket-status';
import User from '../models/sequelize/user';
import { ensureQueryResult } from './utils/query-utils';

export default class TicketService {
  getTicketsBySprint(sprintId: string): Promise<Ticket[]> {
    return ensureQueryResult(
      TeamSprint.findOne({
        where: {
          id: sprintId,
        },
        include: [Ticket],
      }),
    ).then((sprint) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return sprint.tickets!;
    });
  }

  getTicketByIssueNumber(issueNumber: number): Promise<Ticket | null> {
    return Ticket.findOne({
      where: {
        issueNumber,
      },
      include: [
        { model: User, as: 'assignee' },
        { model: User, as: 'author' },
        TicketStatus,
      ],
    });
  }
}
