import {
  BelongsTo,
  Column,
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
  tableName: 'TicketEdits',
})
export default class TicketEdit extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  previousValue?: string;

  @Column(DataType.STRING)
  newValue?: string;

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
  field?:
    | 'TITLE'
    | 'DESCRIPTION'
    | 'ASSIGNEE'
    | 'SPRINT'
    | 'STATUS'
    | 'TAGS'
    | 'TYPE';
}
