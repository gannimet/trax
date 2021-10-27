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
import Ticket from './ticket';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'TicketsTags',
})
export default class TicketTag extends Model {
  @PrimaryKey
  @ForeignKey(() => Tag)
  @Column(DataType.STRING)
  tagId?: string;

  @PrimaryKey
  @ForeignKey(() => Ticket)
  @Column(DataType.STRING)
  ticketId?: string;

  @BelongsTo(() => Tag, 'tagId')
  tag?: Tag;

  @BelongsTo(() => Ticket, 'ticketId')
  ticket?: Ticket;
}
