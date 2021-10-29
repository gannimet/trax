import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Ticket from './ticket';
import User from './user';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'TicketComments',
})
export default class TicketComment extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  text?: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt?: Date;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  authorId?: string;

  @BelongsTo(() => User)
  author?: User;

  @ForeignKey(() => Ticket)
  @Column(DataType.STRING)
  ticketId?: string;

  @BelongsTo(() => Ticket)
  ticket?: Ticket;
}
