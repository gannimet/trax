import express, { json } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import * as dbConf from '../db.conf.json';
import { authMiddleWare } from './middleware/auth.middleware';
import authRouter from './routes/authentication.routes';
import teamRouter from './routes/team.routes';
import userRouter from './routes/user.routes';

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

app.use(json());

/* Routes with NO authentication */
app.use('/auth', authRouter);

/* Routes WITH authentication */
app.use(authMiddleWare);
app.use('/users', userRouter);
app.use('/teams', teamRouter);

app.listen(4000);
