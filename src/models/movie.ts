import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Director from './director';

interface MovieAttributes {}

@Table({
  timestamps: false,
  underscored: true,
})
export default class Movie extends Model<MovieAttributes> {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  name?: string;

  @Column(DataType.INTEGER)
  yearOfRelease?: number;

  @ForeignKey(() => Director)
  @Column(DataType.STRING)
  directorId?: string;

  @BelongsTo(() => Director)
  director?: Director;
}