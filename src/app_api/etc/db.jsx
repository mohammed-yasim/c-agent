import { Sequelize, Model, DataTypes, Op } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();
// console.log(process.env.DB);
const infox_db = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.HOST,
    dialect: 'mariadb',
    logging:false,
    pool: {
        max: 300,
        min: 0,
        idle: 10000,
        acquire: 60000,
        evict: 1000,
    }
});

export { infox_db, Model as infox_model, DataTypes as infox_datatype, Op as infox_op, Sequelize as infox_sequlize }