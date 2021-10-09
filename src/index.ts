import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();
const sequelize = new Sequelize('trax', 'root', 'zeSrK595L2gC', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

const Director = sequelize.define('Director', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

sequelize.authenticate().then(
  () => {
    console.log('Promise resolved - connection successful');
  },
  (err: any) => {
    console.log('Promise rejected with error:', err);
  },
);

app.get('/', (req, res) => {
  Director.findAll().then(
    (data) => {
      res.send(data);
    },
    (err) => {
      console.log('Error querying:', err);
    }
  );
});

app.listen(4000);