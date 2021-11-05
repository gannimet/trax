import { FindOptions } from 'sequelize';
import { HttpErrorString } from '../constants/http-error-string';
import { HttpErrorMessage } from '../controllers/models/http-error-message';
import Tag from '../models/sequelize/tag';
import Team from '../models/sequelize/team';
import TeamSprint from '../models/sequelize/team-sprint';
import Ticket from '../models/sequelize/ticket';
import TicketComment from '../models/sequelize/ticket-comment';
import TicketEdit, {
  TicketEditPrevNextField,
} from '../models/sequelize/ticket-edit';
import TicketStatus from '../models/sequelize/ticket-status';
import TicketType from '../models/sequelize/ticket-type';
import User from '../models/sequelize/user';
import {
  createUUID,
  ensureQueryResult,
  userExcludedAttributes,
} from './utils/query-utils';

const ticketOptions: FindOptions = {
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
    {
      model: TicketEdit,
      include: [
        {
          model: User,
          as: 'editor',
          foreignKey: 'editorId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: User,
          as: 'previousAssignee',
          foreignKey: 'previousAssigneeId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: User,
          as: 'newAssignee',
          foreignKey: 'newAssigneeId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: TeamSprint,
          as: 'previousSprint',
          foreignKey: 'previousSprintId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: TeamSprint,
          as: 'newSprint',
          foreignKey: 'newSprintId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: TicketStatus,
          as: 'previousStatus',
          foreignKey: 'previousStatusId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: TicketStatus,
          as: 'newStatus',
          foreignKey: 'newStatusId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: TicketType,
          as: 'previousType',
          foreignKey: 'previousTypeId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: TicketType,
          as: 'newType',
          foreignKey: 'newTypeId',
          attributes: { exclude: userExcludedAttributes },
        },
        {
          model: Tag,
          as: 'tag',
          foreignKey: 'tagId',
        },
      ],
    },
  ],
  order: [
    [{ model: TicketComment, as: 'comments' }, 'createdAt', 'DESC'],
    [{ model: TicketEdit, as: 'edits' }, 'editedAt', 'DESC'],
  ],
};

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

  getTicketById(ticketId: string): Promise<Ticket | null> {
    return Ticket.findByPk(ticketId, ticketOptions);
  }

  getTicketByIssueNumber(issueNumber: number): Promise<Ticket | null> {
    return Ticket.findOne({
      ...ticketOptions,
      where: {
        issueNumber,
      },
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
      return this.getTicketById(ticketId);
    });
  }

  editTicketField(
    ticketId: string,
    editorId: string,
    field: TicketEditPrevNextField,
    newValue: string | number | undefined | null,
  ): Promise<Ticket | null> {
    // TODO check user permission to edit tickets
    if (!this.hasTicketEditFieldValidValue(field, newValue)) {
      return Promise.reject(HttpErrorString.BAD_REQUEST);
    }

    return Ticket.findByPk(ticketId, {
      include: [{ model: TicketStatus }, { model: TicketType }, { model: Tag }],
    }).then((ticket) => {
      if (!ticket) {
        return null;
      }

      let prevValue: string | number | undefined;
      let prevColumnName: keyof TicketEdit;
      let newColumnName: keyof TicketEdit;

      switch (field) {
        case 'TITLE':
          prevValue = ticket.title;
          prevColumnName = 'previousValue';
          newColumnName = 'newValue';
          ticket.title = newValue as string;
          break;
        case 'DESCRIPTION':
          prevValue = ticket.description;
          prevColumnName = 'previousValue';
          newColumnName = 'newValue';
          ticket.description = newValue as string;
          break;
        case 'ESTIMATE':
          prevValue = ticket.estimate;
          prevColumnName = 'previousNumber';
          newColumnName = 'newNumber';
          ticket.estimate = newValue as number;
          break;
        case 'ASSIGNEE':
          prevValue = ticket.assigneeId;
          prevColumnName = 'previousAssigneeId';
          newColumnName = 'newAssigneeId';
          ticket.assigneeId = newValue as string;
          break;
        case 'SPRINT':
          prevValue = ticket.sprintId;
          prevColumnName = 'previousSprintId';
          newColumnName = 'newSprintId';
          ticket.sprintId = newValue as string;
          break;
        case 'STATUS':
          prevValue = ticket.statusId;
          prevColumnName = 'previousStatusId';
          newColumnName = 'newStatusId';
          ticket.statusId = newValue as string;
          break;
        case 'TYPE':
          prevValue = ticket.typeId;
          prevColumnName = 'previousTypeId';
          newColumnName = 'newTypeId';
          ticket.typeId = newValue as string;
          break;
      }

      const id = createUUID();
      const primaryPromise = ticket.save();
      const secondaryPromise = TicketEdit.create({
        id,
        ticketId,
        editorId,
        field,
        editedAt: new Date(),
        [prevColumnName]: prevValue,
        [newColumnName]: newValue,
      });

      return Promise.all([primaryPromise, secondaryPromise]).then(() => {
        return this.getTicketById(ticketId);
      });
    });
  }

  private hasTicketEditFieldValidValue(
    field: TicketEditPrevNextField,
    value: string | number | undefined | null,
  ): boolean {
    switch (field) {
      case 'TITLE':
        return value !== '' && typeof value === 'string';
      case 'DESCRIPTION':
        return value === null || typeof value === 'string';
      case 'ESTIMATE':
        return value === null || typeof value === 'number';
      case 'ASSIGNEE':
        return value === null || typeof value === 'string';
      case 'SPRINT':
        return value !== '' || typeof value === 'string';
      case 'STATUS':
        return value !== '' || typeof value === 'string';
      case 'TYPE':
        return value !== '' || typeof value === 'string';
      default:
        return false;
    }
  }
}
