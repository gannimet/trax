import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import * as dbConf from '../db.conf.json';
import router from './routes/user.routes';

const app = express();
const sequelize = new Sequelize({
  ...dbConf,
  dialect: dbConf.dialect as Dialect,
  models: [__dirname + '/models'],
});

sequelize.authenticate().then(
  () => {
    console.log('Sequelize authentication successful');
  },
  (err: Error) => {
    console.log('Sequelize authentication failed with error:', err);
  },
);

app.use('/users', router);

app.listen(4000);
