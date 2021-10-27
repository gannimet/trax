import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Ticket from './ticket';
import TicketTag from './ticket-tag';

@Table({
  timestamps: false,
  underscored: true,
})
export default class Tag extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  name?: string;

  @Column(DataType.STRING)
  color?: string;

  @BelongsToMany(() => Ticket, () => TicketTag)
  tickets?: Ticket[];
}
