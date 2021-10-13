import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import User from './user';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'UserRoles',
})
export default class UserRole extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  name?: string;

  @Column(DataType.BOOLEAN)
  canEditTeams?: boolean;

  @Column(DataType.BOOLEAN)
  canDeleteTeams?: boolean;

  @HasMany(() => User)
  users?: User[];
}
