"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = exports.ServiceArea = exports.Receipt = exports.Invoice = exports.Daybook = exports.Customer = exports.Configuration = exports.Activity = void 0;
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
  sequelize: _db.infox_db,
  tableName: 'configurations'
});
class User extends _db.infox_model {}
exports.User = User;
User.init({
  u_id: {
    primaryKey: true,
    type: _db.infox_sequlize.UUID,
    defaultValue: _db.infox_datatype.UUIDV4,
    allowNull: false
  },
  email: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  passwd: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  u_name: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  u_mob: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  u_profile: {
    type: _db.infox_datatype.JSON,
    allowNull: true
  },
  active: {
    type: _db.infox_datatype.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  suspended: {
    type: _db.infox_datatype.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  sequelize: _db.infox_db,
  tableName: 'users'
});
class ServiceArea extends _db.infox_model {}
exports.ServiceArea = ServiceArea;
ServiceArea.init({
  s_id: {
    primaryKey: true,
    type: _db.infox_sequlize.UUID,
    defaultValue: _db.infox_datatype.UUIDV4,
    allowNull: false
  },
  name: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  code: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  place: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  lat: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  lng: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  contact_no: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  contact_name: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  }
}, {
  sequelize: _db.infox_db,
  tableName: 'service_areas'
});
class Daybook extends _db.infox_model {}
exports.Daybook = Daybook;
Daybook.init({
  referenceNumber: {
    type: _db.infox_datatype.STRING
  },
  date: {
    type: _db.infox_datatype.DATEONLY,
    allowNull: false
  },
  description: {
    type: _db.infox_datatype.STRING,
    allowNull: true
  },
  debitAmount: {
    type: _db.infox_datatype.DECIMAL(10, 2),
    allowNull: false
  },
  creditAmount: {
    type: _db.infox_datatype.DECIMAL(10, 2),
    allowNull: false
  },
  accountName: {
    type: _db.infox_datatype.STRING,
    allowNull: true
  },
  notes: {
    type: _db.infox_datatype.TEXT,
    allowNull: true
  }
}, {
  sequelize: _db.infox_db,
  tableName: 'daybooks'
});
class Customer extends _db.infox_model {}
exports.Customer = Customer;
class Invoice extends _db.infox_model {}
exports.Invoice = Invoice;
class Receipt extends _db.infox_model {}
exports.Receipt = Receipt;
class Activity extends _db.infox_model {}
exports.Activity = Activity;
Customer.init({
  c_id: {
    primaryKey: true,
    type: _db.infox_sequlize.UUID,
    defaultValue: _db.infox_sequlize.UUIDV4,
    allowNull: false
  },
  name: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  address: {
    type: _db.infox_datatype.TEXT,
    allowNull: false
  },
  contact_no: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  whatsapp_no: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  qr_code: {
    type: _db.infox_datatype.TEXT,
    allowNull: true
  },
  geo_location: {
    type: _db.infox_datatype.TEXT,
    allowNull: true
  },
  email: {
    type: _db.infox_datatype.STRING,
    allowNull: false,
    defaultValue: "**##**##"
  },
  mobile: {
    type: _db.infox_datatype.STRING,
    allowNull: false,
    defaultValue: "**##**##"
  },
  password: {
    type: _db.infox_datatype.STRING,
    allowNull: false,
    defaultValue: "**##**##"
  },
  active: {
    type: _db.infox_datatype.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  suspended: {
    type: _db.infox_datatype.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  sequelize: _db.infox_db,
  tableName: 'customers'
});
Invoice.init({
  i_id: {
    primaryKey: true,
    type: _db.infox_sequlize.UUID,
    defaultValue: _db.infox_datatype.UUIDV4,
    allowNull: false
  },
  _no: {
    type: _db.infox_datatype.STRING,
    allowNull: true
  },
  _type: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  _desc: {
    type: _db.infox_datatype.TEXT,
    allowNull: false
  },
  amount: {
    type: _db.infox_datatype.DECIMAL,
    allowNull: false
  },
  date: {
    type: _db.infox_datatype.DATEONLY,
    allowNull: false
  },
  deleted: {
    type: _db.infox_datatype.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  data: {
    type: _db.infox_datatype.JSON,
    allowNull: true
  }
}, {
  sequelize: _db.infox_db,
  tableName: 'invoices'
});
Receipt.init({
  r_id: {
    primaryKey: true,
    type: _db.infox_sequlize.UUID,
    defaultValue: _db.infox_datatype.UUIDV4,
    allowNull: false
  },
  _no: {
    type: _db.infox_datatype.STRING,
    allowNull: true
  },
  _type: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  _desc: {
    type: _db.infox_datatype.TEXT,
    allowNull: true
  },
  amount: {
    type: _db.infox_datatype.DECIMAL,
    allowNull: false
  },
  date: {
    type: _db.infox_datatype.DATEONLY,
    allowNull: false
  },
  deleted: {
    type: _db.infox_datatype.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  data: {
    type: _db.infox_datatype.JSON,
    allowNull: true
  }
}, {
  sequelize: _db.infox_db,
  tableName: 'receipts'
});
Activity.init({
  _type: {
    type: _db.infox_datatype.STRING,
    allowNull: false
  },
  _desc: {
    type: _db.infox_datatype.TEXT,
    allowNull: false
  },
  deleted: {
    type: _db.infox_datatype.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  sequelize: _db.infox_db,
  tableName: 'activities'
});
User.hasMany(ServiceArea, {
  foreignKey: {
    name: '_owner_uid',
    allowNull: false
  },
  as: 'serviceareas'
});
User.hasMany(User, {
  foreignKey: {
    name: '_owner_uid',
    allowNull: true
  },
  as: 'agents'
});
ServiceArea.hasMany(Customer, {
  foreignKey: {
    name: '_sid',
    allowNull: false
  },
  as: 'customers'
});
Customer.hasMany(Invoice, {
  foreignKey: {
    name: '_cid',
    allowNull: false
  },
  as: 'customer_invoices'
});
Customer.hasMany(Receipt, {
  foreignKey: {
    name: '_cid',
    allowNull: false
  },
  as: 'customer_receipts'
});
Customer.hasMany(Activity, {
  foreignKey: {
    name: '_cid',
    allowNull: false
  },
  as: 'customer_activities'
});
Invoice.belongsTo(Customer, {
  foreignKey: {
    name: '_cid',
    allowNull: false
  },
  as: 'customer'
});
Receipt.belongsTo(Customer, {
  foreignKey: {
    name: '_cid',
    allowNull: false
  },
  as: 'customer'
});
Activity.belongsTo(Customer, {
  foreignKey: {
    name: '_cid',
    allowNull: false
  },
  as: 'customer'
});
ServiceArea.hasMany(Daybook, {
  foreignKey: {
    name: '_sid',
    allowNull: false
  },
  as: 'service_day_book'
});
ServiceArea.hasMany(Invoice, {
  foreignKey: {
    name: '_sid',
    allowNull: false
  },
  as: 'service_invoices'
});
ServiceArea.hasMany(Receipt, {
  foreignKey: {
    name: '_sid',
    allowNull: false
  },
  as: 'service_receipts'
});
ServiceArea.hasMany(Activity, {
  foreignKey: {
    name: '_sid',
    allowNull: false
  },
  as: 'service_activities'
});
Invoice.belongsTo(Receipt, {
  foreignKey: {
    name: '_rid',
    allowNull: true
  },
  as: 'receipt'
});
Receipt.belongsTo(Invoice, {
  foreignKey: {
    name: '_iid',
    allowNull: true
  },
  as: 'invoice'
});
Daybook.belongsTo(User, {
  foreignKey: {
    name: '_uid',
    allowNull: false
  },
  as: 'day_book'
});
Invoice.belongsTo(User, {
  foreignKey: {
    name: '_uid',
    allowNull: false
  },
  as: 'invoices'
});
Receipt.belongsTo(User, {
  foreignKey: {
    name: '_uid',
    allowNull: false
  },
  as: 'receipts'
});
Activity.belongsTo(User, {
  foreignKey: {
    name: '_uid',
    allowNull: false
  },
  as: 'activities'
});
User.belongsToMany(ServiceArea, {
  through: 'UserServiceArea'
});
ServiceArea.belongsToMany(User, {
  through: 'UserServiceArea'
});