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
import TicketEditableField from './ticket-editable-field';
import User from './user';

@Table({
  timestamps: false,
  underscored: true,
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

  @ForeignKey(() => TicketEditableField)
  @Column(DataType.STRING)
  fieldId?: string;

  @BelongsTo(() => TicketEditableField)
  field?: TicketEditableField;
}
