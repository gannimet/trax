import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import TeamUser from './team-user';
import User from './user';

@Table({
  timestamps: false,
  underscored: true,
})
export default class Team extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  name?: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.BLOB)
  avatar?: Blob;

  @BelongsToMany(() => User, () => TeamUser)
  users?: User[];
}
