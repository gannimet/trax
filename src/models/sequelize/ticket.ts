import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import Tag from './tag';
import TeamSprint from './team-sprint';
import TicketStatus from './ticket-status';
import TicketTag from './ticket-tag';
import TicketType from './ticket-type';
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

  @Column(DataType.INTEGER)
  estimate?: number;

  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  issueNumber?: number;

  @BelongsTo(() => User, 'authorId')
  author?: User;

  @BelongsTo(() => User, 'assigneeId')
  assignee?: User;

  @ForeignKey(() => TicketStatus)
  @Column(DataType.STRING)
  statusId?: string;

  @BelongsTo(() => TicketStatus)
  status?: TicketStatus;

  @ForeignKey(() => TeamSprint)
  @Column(DataType.STRING)
  sprintId?: string;

  @BelongsTo(() => TeamSprint, 'sprintId')
  sprint?: TeamSprint;

  @BelongsTo(() => TicketType, 'typeId')
  ticketType?: TicketType;

  @BelongsToMany(() => Tag, () => TicketTag)
  tags?: Tag[];
}
