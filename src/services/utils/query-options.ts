import { FindOptions, Includeable, IncludeOptions, Order } from 'sequelize';
import Tag from '../../models/sequelize/tag';
import TeamSprint from '../../models/sequelize/team-sprint';
import TicketComment from '../../models/sequelize/ticket-comment';
import TicketEdit from '../../models/sequelize/ticket-edit';
import TicketStatus from '../../models/sequelize/ticket-status';
import TicketType from '../../models/sequelize/ticket-type';
import User from '../../models/sequelize/user';
import { userExcludedAttributes } from './query-utils';

export const getTicketIncludeOptions = (
  extension?: Includeable[],
): IncludeOptions => {
  const nonNullableExtension = extension ? extension : [];

  return {
    include: [
      ...nonNullableExtension,
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
  };
};

export const ticketOrderOptions: Order = [
  [{ model: TicketComment, as: 'comments' }, 'createdAt', 'DESC'],
  [{ model: TicketEdit, as: 'edits' }, 'editedAt', 'DESC'],
];

export const ticketQueryOptions: FindOptions = {
  ...getTicketIncludeOptions(),
  order: ticketOrderOptions,
};
