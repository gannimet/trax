import { HttpErrorString } from '../constants/http-error-string';
import { HttpErrorMessage } from '../controllers/models/http-error-message';
import Tag from '../models/sequelize/tag';
import Team from '../models/sequelize/team';
import TeamSprint from '../models/sequelize/team-sprint';
import Ticket from '../models/sequelize/ticket';
import TicketComment from '../models/sequelize/ticket-comment';
import TicketEdit from '../models/sequelize/ticket-edit';
import TicketStatus from '../models/sequelize/ticket-status';
import TicketType from '../models/sequelize/ticket-type';
import User from '../models/sequelize/user';
import {
  createUUID,
  ensureQueryResult,
  userExcludedAttributes,
} from './utils/query-utils';

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
      order: [[{ model: TicketComment, as: 'comments' }, 'createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          foreignKey: 'authorId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: User,
          as: 'assignee',
          foreignKey: 'assigneeId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: TicketStatus,
          foreignKey: 'statusId',
        },
        {
          model: TicketType,
          foreignKey: 'typeId',
        },
        {
          model: TicketComment,
          include: [
            {
              model: User,
              as: 'author',
              attributes: { exclude: userExcludedAttributes },
            },
          ],
        },
        Tag,
        TicketEdit,
      ],
    });
  }

  createTicket(
    sprintId: string,
    userId: string,
    title: string,
    description?: string,
    assigneeId?: string,
  ): Promise<Ticket> {
    return ensureQueryResult(
      TeamSprint.findOne({
        where: {
          id: sprintId,
        },
        include: [Team],
      }),
    ).then((sprint) => {
      if (!sprint.team) {
        return Promise.reject({
          statusCode: 404,
          errorMessage: HttpErrorString.RESOURCE_NOT_FOUND,
        } as HttpErrorMessage);
      }

      const { initialTicketStatusId } = sprint.team;
      const id = createUUID();

      return Ticket.create({
        id,
        title,
        description,
        authorId: userId,
        assigneeId,
        createdAt: new Date(),
        statusId: initialTicketStatusId,
        sprintId,
      });
    });
  }

  addTicketComment(
    ticketId: string,
    authorId: string,
    text: string,
  ): Promise<Ticket | null> {
    const id = createUUID();

    return TicketComment.create({
      id,
      ticketId,
      authorId,
      text,
      createdAt: new Date(),
    }).then(() => {
      return Ticket.findByPk(ticketId, {
        include: {
          all: true,
          nested: true,
          attributes: { exclude: userExcludedAttributes },
        },
      });
    });
  }
}
