import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'TicketTypes',
})
export default class TicketType extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  name?: string;

  @Column(DataType.BOOLEAN)
  convertible?: boolean;
}
