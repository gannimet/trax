import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Tag from './tag';
import TeamSprint from './team-sprint';
import Ticket from './ticket';
import TicketStatus from './ticket-status';
import TicketType from './ticket-type';
import User from './user';

export type TicketEditPrevNextField =
  | 'TITLE'
  | 'DESCRIPTION'
  | 'ASSIGNEE'
  | 'SPRINT'
  | 'STATUS'
  | 'TYPE';

export type TicketEditTagField = 'ADD_TAG' | 'REMOVE_TAG';

export type TicketEditField = TicketEditPrevNextField | TicketEditTagField;

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'TicketEdits',
})
export default class TicketEdit extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.DATE)
  editedAt?: Date;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  editorId?: string;

  @BelongsTo(() => User)
  editor?: User;

  @ForeignKey(() => Ticket)
  @Column(DataType.STRING)
  ticketId?: string;

  @BelongsTo(() => Ticket)
  ticket?: Ticket;

  @Column(DataType.STRING)
  field?: TicketEditField;

  @Column(DataType.STRING)
  previousValue?: string;

  @Column(DataType.STRING)
  newValue?: string;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  previousAssigneeId?: string;

  @BelongsTo(() => User)
  previousAssignee?: User;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  newAssigneeId?: string;

  @BelongsTo(() => User)
  newAssignee?: User;

  @ForeignKey(() => TeamSprint)
  @Column(DataType.STRING)
  previousSprintId?: string;

  @BelongsTo(() => TeamSprint)
  previousSprint?: TeamSprint;

  @ForeignKey(() => TeamSprint)
  @Column(DataType.STRING)
  newSprintId?: string;

  @BelongsTo(() => TeamSprint)
  newSprint?: TeamSprint;

  @ForeignKey(() => TicketStatus)
  @Column(DataType.STRING)
  previousStatusId?: string;

  @BelongsTo(() => TicketStatus)
  previousStatus?: TicketStatus;

  @ForeignKey(() => TicketStatus)
  @Column(DataType.STRING)
  newStatusId?: string;

  @BelongsTo(() => TicketStatus)
  newStatus?: TicketStatus;

  @ForeignKey(() => TicketType)
  @Column(DataType.STRING)
  previousTypeId?: string;

  @BelongsTo(() => TicketType)
  previousType?: TicketType;

  @ForeignKey(() => TicketType)
  @Column(DataType.STRING)
  newTypeId?: string;

  @BelongsTo(() => TicketType)
  newType?: TicketType;

  @ForeignKey(() => Tag)
  @Column(DataType.STRING)
  tagId?: string;

  @BelongsTo(() => Tag)
  tag?: Tag;
}
