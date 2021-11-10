import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Team from './team';
import TicketStatusTransition from './ticket-status-transition';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'TicketStatus',
})
export default class TicketStatus extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  name?: string;

  @ForeignKey(() => Team)
  @Column(DataType.STRING)
  teamId?: string;

  @BelongsTo(() => Team)
  team?: Team;

  @HasMany(() => Team, 'initialTicketStatusId')
  initialStatusForTeam?: Team;

  @HasMany(() => TicketStatusTransition, 'previousStatusId')
  transitionsFrom?: TicketStatusTransition[];

  @HasMany(() => TicketStatusTransition, 'nextStatusId')
  transitionsTo?: TicketStatusTransition[];
}
