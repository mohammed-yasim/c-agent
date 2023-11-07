"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Configuration = void 0;
var _db = require("../db");
class Configuration extends _db.infox_model {}
exports.Configuration = Configuration;
Configuration.init({
  name: {
    type: _db.infox_datatype.STRING,
    allowNull: true
  },
  type: {
    type: _db.infox_datatype.STRING,
    allowNull: true
  },
  key: {
    type: _db.infox_datatype.STRING,
    allowNull: true
  },
  value: {
    type: _db.infox_datatype.TEXT,
    allowNull: true
  }
}, {
  sequelize: _db.infox_db
});