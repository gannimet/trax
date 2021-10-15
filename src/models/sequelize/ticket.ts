import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import TeamSprint from './team-sprint';
import TicketStatus from './ticket-status';
import User from './user';

@Table({
  timestamps: false,
  underscored: true,
})
export default class Ticket extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  title?: string;

  @Column(DataType.STRING)
  description?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt?: Date;

  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  issueNumber?: number;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  authorId?: string;

  @BelongsTo(() => User)
  author?: User;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  assigneeId?: string;

  @BelongsTo(() => User)
  assignee?: User;

  @ForeignKey(() => TicketStatus)
  @Column(DataType.STRING)
  statusId?: string;

  @BelongsTo(() => TicketStatus)
  status?: TicketStatus;

  @ForeignKey(() => TeamSprint)
  @Column(DataType.STRING)
  sprintId?: string;

  @BelongsTo(() => TeamSprint)
  sprint?: TeamSprint;
}
