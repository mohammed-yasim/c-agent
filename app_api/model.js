"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Configuration = void 0;
var _db = require("./etc/db");
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
class User extends _db.infox_model {}
User.init({}, {
  sequelize: _db.infox_db
});
class ServiceArea extends _db.infox_model {}
ServiceArea.init({}, {
  sequelize: _db.infox_db
});
class DayBook extends _db.infox_model {}
DayBook.init({}, {
  sequelize: _db.infox_db
});
class Customer extends _db.infox_model {}
class Invoice extends _db.infox_model {}
class Receipt extends _db.infox_model {}
class Activity extends _db.infox_model {}
Customer.init({}, {
  sequelize: _db.infox_db
});
Invoice.init({}, {
  sequelize: _db.infox_db
});
Receipt.init({}, {
  sequelize: _db.infox_db
});
Activity.init({}, {
  sequelize: _db.infox_db
});
ServiceArea.hasMany(User);
ServiceArea.hasMany(Customer);
ServiceArea.hasMany(Invoice);
ServiceArea.hasMany(DayBook);
Customer.hasMany(Invoice);
Customer.hasMany(Receipt);
Customer.hasMany(Activity);