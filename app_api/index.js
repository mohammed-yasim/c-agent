"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _express = require("express");
var _model = require("./model");
var jwt = _interopRequireWildcard(require("jsonwebtoken"));
var _db = require("./etc/db");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var API = (0, _express.Router)();
API.get('/', (r, s) => {
  s.status(200).json({
    status: 'OK'
  });
});
var secretKey = "ABC_secret";
API.post('/login', (req, res) => {
  var {
    username,
    password
  } = req.body;
  if (username === 'user@domain.tld' && password === 'password') {
    var data = {};
    data['dXNlcg'] = new Buffer.from('8dd9e64e-7e02-11ee-acae-5405dbe7a86c').toString('base64');
    var token = jwt.sign(data, secretKey, {
      expiresIn: '1h'
    });
    res.json({
      token
    });
  } else {
    res.status(401).send('Invalid credentials');
  }
});
API.use((req, res, next) => {
  var token = req.headers.authorization || false;
  if (token) {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.error('JWT Verification Error:', error.message);
      } else {
        req.user_data = Buffer.from(decoded.dXNlcg, 'base64').toString('utf-8');
        next();
      }
    });
  } else {
    res.status(401).send('error');
  }
});
API.use((req, res, next) => {
  console.log('USER:', req.user_data);
  next();
});
API.get('/sync', (req, res) => {
  _model.User.findOne({
    where: {},
    include: [{
      model: _model.ServiceArea,
      through: {
        attributes: []
      }
    }]
  }).then(data => {
    if (data) {
      res.json(data);
    } else {
      res.json({});
    }
  }).catch(error => {
    res.status(404).send(error);
  });
});
API.get('/service_areas', (req, res) => {
  _model.User.findOne({
    where: {},
    include: [{
      model: _model.ServiceArea,
      as: 'serviceareas'
    }]
  }).then(data => {
    res.json(data);
  }).catch(error => {
    res.status(404).send(error);
  });
});
API.get('/fetch/:_sid', (req, res) => {
  var _sid = req.params._sid;
  var date = req.query.date;
  var balance = new Promise((resolve, reject) => {
    _model.DayBook.findAndCountAll({
      attributes: [[_db.infox_sequlize.fn('COALESCE', _db.infox_sequlize.fn('SUM', _db.infox_sequlize.col('creditAmount')), 0), 'credit'], [_db.infox_sequlize.fn('COALESCE', _db.infox_sequlize.fn('SUM', _db.infox_sequlize.col('debitAmount')), 0), 'debit']],
      where: {
        date: new Date(date),
        _sid: _sid
      }
    }).then(data => {
      var append_data = {
        credit: 0,
        debit: 0
      };
      if ((data === null || data === void 0 ? void 0 : data.count) > 0) {
        append_data = data.rows[0].dataValues;
      }
      resolve(_objectSpread({
        transactions: data === null || data === void 0 ? void 0 : data.count
      }, append_data));
    }).catch(error => reject(error));
  });
  var service_area = new Promise((resolve, reject) => {
    _model.ServiceArea.findOne({
      where: {
        s_id: _sid
      }
    }).then(data => resolve(data)).catch(error => reject(error));
  });
  var customers = new Promise((resolve, reject) => {
    _model.Customer.count({
      where: {
        _sid: _sid
      }
    }).then(data => resolve(data)).catch(error => reject(error));
  });
  Promise.all([service_area, balance, customers]).then(data => {
    res.json({
      date: date,
      service_area: data[0],
      balance: data[1],
      customers: data[2]
    });
  }).catch(error => {
    res.status(404).send(error);
  });
});
API.use("/*", function (req, res, next) {
  res.status(404).json({
    error: 404
  });
});
var _default = exports.default = API;