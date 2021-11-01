import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import Tag from './tag';
import TeamSprint from './team-sprint';
import TicketComment from './ticket-comment';
import TicketEdit from './ticket-edit';
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

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  authorId?: string;

  @BelongsTo(() => User, 'authorId')
  author?: User;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  assigneeId?: string;

  @BelongsTo(() => User, 'assigneeId')
  assignee?: User;

  @ForeignKey(() => TicketStatus)
  @Column(DataType.STRING)
  statusId?: string;

  @BelongsTo(() => TicketStatus, 'statusId')
  status?: TicketStatus;

  @ForeignKey(() => TeamSprint)
  @Column(DataType.STRING)
  sprintId?: string;

  @BelongsTo(() => TeamSprint, 'sprintId')
  sprint?: TeamSprint;

  @ForeignKey(() => TicketType)
  @Column(DataType.STRING)
  typeId?: string;

  @BelongsTo(() => TicketType, 'typeId')
  type?: TicketType;

  @BelongsToMany(() => Tag, () => TicketTag)
  tags?: Tag[];

  @HasMany(() => TicketEdit)
  edits?: TicketEdit[];

  @HasMany(() => TicketComment)
  comments?: TicketComment[];
}
