import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import * as dbConf from '../db.conf.json';
import Director from './models/director';
import Movie from './models/movie';

const app = express();
const sequelize = new Sequelize({
  ...dbConf,
  dialect: dbConf.dialect as Dialect,
  models: [__dirname + '/models'],
});

sequelize.authenticate().then(
  () => {
    console.log('Promise resolved - connection successful');
  },
  (err: Error) => {
    console.log('Promise rejected with error:', err);
  },
);

app.get('/', (req, res) => {
  // Movie.findAll({ include: [Director] }).then(
  //   (data) => {
  //     res.send(data);
  //   },
  //   (err) => {
  //     console.log('Error querying:', err);
  //   }
  // );

  Director.findAll({ include: [Movie] }).then(
    (data) => {
      res.send(data);
    },
    (err) => {
      console.log('Error querying:', err);
    },
  );
});

app.listen(4000);
