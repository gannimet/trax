import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import TicketStatus from './ticket-status';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'TicketStatusTransitions',
})
export default class TicketStatusTransition extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @ForeignKey(() => TicketStatus)
  @Column(DataType.STRING)
  previousStatusId?: string;

  @BelongsTo(() => TicketStatus)
  previousStatus?: TicketStatus;

  @ForeignKey(() => TicketStatus)
  @Column(DataType.STRING)
  nextStatusId?: string;

  @BelongsTo(() => TicketStatus)
  nextStatus?: TicketStatus;
}
