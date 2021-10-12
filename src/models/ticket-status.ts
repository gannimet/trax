import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Team from './team';

@Table({
  timestamps: false,
  underscored: true,
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
}
