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
import Ticket from './ticket';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'TeamsSprints',
})
export default class TeamSprint extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  name?: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.BOOLEAN)
  active?: boolean;

  @Column(DataType.INTEGER)
  sortIndex?: number;

  @ForeignKey(() => Team)
  @Column(DataType.STRING)
  teamId?: string;

  @BelongsTo(() => Team)
  team?: Team;

  @HasMany(() => Ticket)
  tickets?: Ticket[];
}
