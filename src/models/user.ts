import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Team from './team';
import TeamUser from './team-user';

@Table({
  timestamps: false,
  underscored: true,
})
export default class User extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  firstName?: string;

  @Column(DataType.STRING)
  lastName?: string;

  @Column(DataType.STRING)
  email?: string;

  @Column(DataType.BOOLEAN)
  emailVerified?: boolean;

  @Column(DataType.BLOB)
  avatar?: Blob;

  @Column(DataType.STRING)
  password?: string;

  @BelongsToMany(() => Team, () => TeamUser)
  teams?: Team[];
}
