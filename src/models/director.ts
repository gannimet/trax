import { Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Movie from './movie';

interface DirectorAttributes {}

@Table({
  timestamps: false,
  underscored: true,
})
export default class Director extends Model<DirectorAttributes> {
  @PrimaryKey
  @Column(DataType.STRING)
  id?: string;

  @Column(DataType.STRING)
  firstName?: string;

  @Column(DataType.STRING)
  lastName?: string;

  @HasMany(() => Movie)
  movies?: Movie[];
}