"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "infox_datatype", {
  enumerable: true,
  get: function get() {
    return _sequelize.DataTypes;
  }
});
exports.infox_db = void 0;
Object.defineProperty(exports, "infox_model", {
  enumerable: true,
  get: function get() {
    return _sequelize.Model;
  }
});
Object.defineProperty(exports, "infox_op", {
  enumerable: true,
  get: function get() {
    return _sequelize.Op;
  }
});
Object.defineProperty(exports, "infox_sequlize", {
  enumerable: true,
  get: function get() {
    return _sequelize.Sequelize;
  }
});
var _sequelize = require("sequelize");
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_dotenv.default.config();
var infox_db = exports.infox_db = new _sequelize.Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.HOST,
  dialect: 'mariadb',
  logging: false,
  pool: {
    max: 300,
    min: 0,
    idle: 10000,
    acquire: 60000,
    evict: 1000
  }
});