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
import User from './user';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'TeamsUsers',
})
export default class TeamUser extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.BOOLEAN)
  canEditTickets?: boolean;

  @Column(DataType.BOOLEAN)
  canDeleteTickets?: boolean;

  @Column(DataType.BOOLEAN)
  canEditSprints?: boolean;

  @Column(DataType.BOOLEAN)
  canDeleteSprints?: boolean;

  @ForeignKey(() => Team)
  @Column(DataType.STRING)
  teamId?: string;

  @BelongsTo(() => Team)
  team?: Team;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  userId?: string;

  @BelongsTo(() => User)
  user?: User;
}
