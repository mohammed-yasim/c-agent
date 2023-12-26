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
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/web.url.to-json.js");
require("core-js/modules/es.array.reduce.js");
var _express = require("express");
var _model = require("./model");
var jwt = _interopRequireWildcard(require("jsonwebtoken"));
var _db = require("./etc/db");
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var API = (0, _express.Router)();
function generateRandomHash() {
  var randomBytes = _crypto.default.randomBytes(3);
  var randomHash = randomBytes.toString('HEX').toLowerCase();
  return randomHash;
}
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
  _model.User.findOne({
    where: {
      email: username,
      active: 1,
      suspended: 0
    },
    include: [{
      model: _model.ServiceArea,
      through: {
        attributes: []
      },
      attributes: ['s_id']
    }]
  }).then(user => {
    if (user) {
      _bcryptjs.default.compare(password, user.passwd, (error, match) => {
        if (error) {
          res.status(406).send("invalid credentials,".concat(error));
        } else if (match) {
          var _user$ServiceAreas;
          var data = {};
          data['service_areas'] = user === null || user === void 0 || (_user$ServiceAreas = user.ServiceAreas) === null || _user$ServiceAreas === void 0 ? void 0 : _user$ServiceAreas.map(a => {
            return a.s_id;
          });
          data['dXNlcg'] = new Buffer.from(user.u_id).toString('base64');
          data['dXNlcg'] = generateRandomHash() + data.dXNlcg + generateRandomHash();
          var token = jwt.sign(data, secretKey, {
            expiresIn: '24h'
          });
          res.json({
            token
          });
        } else {
          res.status(406).send('invalid credentials');
        }
      });
    } else {
      res.status(406).send('inactive/invalid credentials/suspended');
    }
  }).catch(err => {
    res.status(404).send("".concat(err));
  });
});
API.get('/gen', (req, res) => {
  var _req$query;
  _bcryptjs.default.hash((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.password, 10, (error, hash) => {
    if (error) {
      res.status(500).send("? ".concat(error));
    } else {
      res.send(hash);
    }
  });
});
API.use((req, res, next) => {
  var token = req.headers.authorization || false;
  if (token) {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        res.status(401).send('error');
      } else {
        req.user_token_data = decoded;
        var _uid = String(decoded.dXNlcg).slice(6).slice(0, -6);
        req._uid = Buffer.from(_uid, 'base64').toString('utf-8');
        _model.User.findOne({
          where: {
            u_id: req._uid
          },
          attributes: ['u_id'],
          include: [{
            model: _model.ServiceArea,
            as: 'serviceareas',
            attributes: ['s_id']
          }]
        }).then(data => {
          if (data) {
            req.user_data = data.serviceareas.map(a => {
              return a.s_id;
            });
            next();
          } else {
            res.status(401).send('error');
          }
        }).catch(error => {
          res.status(406).send(error);
        });
      }
    });
  } else {
    res.status(401).send('error');
  }
});
API.get('/sync', (req, res) => {
  _model.User.findOne({
    where: {
      u_id: req._uid
    },
    attributes: [],
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
API.get('/fetch/:_sid', (req, res) => {
  var _sid = req.params._sid;
  var date = req.query.date;
  var balance = new Promise((resolve, reject) => {
    _model.Daybook.findAndCountAll({
      attributes: [[_db.infox_sequlize.fn('COALESCE', _db.infox_sequlize.fn('SUM', _db.infox_sequlize.col('creditAmount')), 0), 'credit'], [_db.infox_sequlize.fn('COALESCE', _db.infox_sequlize.fn('SUM', _db.infox_sequlize.col('debitAmount')), 0), 'debit']],
      where: {
        date: new Date(date),
        _sid: _sid,
        _uid: req._uid
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
        _sid: _sid,
        createdAt: {
          [_db.infox_op.lte]: new Date(date).setHours(23, 59, 59, 999)
        },
        active: 1
      }
    }).then(data => resolve(data)).catch(error => reject(error));
  });
  var pending = new Promise((resolve, reject) => {
    _model.Invoice.count({
      where: {
        date: {
          [_db.infox_op.lte]: new Date(date).setHours(23, 59, 59, 999)
        },
        _sid: _sid,
        _rid: null,
        deleted: 0
      }
    }).then(data => resolve(data)).catch(error => reject(error));
  });
  var colllection = new Promise((resolve, reject) => {
    _model.Receipt.count({
      where: {
        date: new Date(date),
        _sid: _sid,
        _uid: req._uid,
        deleted: 0
      }
    }).then(data => resolve(data)).catch(error => reject(error));
  });
  Promise.all([service_area, balance, customers, pending, colllection]).then(data => {
    res.json({
      date: date,
      service_area: data[0],
      balance: data[1],
      customers: data[2],
      pending: data[3],
      collection: data[4],
      u_id: req._uid
    });
  }).catch(error => {
    res.status(404).send(error);
  });
});
API.get('/customers/:_sid', (req, res) => {
  var _req$user_token_data;
  if (req !== null && req !== void 0 && (_req$user_token_data = req.user_token_data) !== null && _req$user_token_data !== void 0 && _req$user_token_data.service_areas.includes(req.params._sid)) {
    _model.Customer.findAll({
      where: {
        _sid: req.params._sid
      },
      include: [{
        model: _model.Invoice,
        as: 'customer_invoices',
        attributes: ['amount'],
        where: {
          deleted: 0
        },
        required: false
      }, {
        model: _model.Receipt,
        as: 'customer_receipts',
        attributes: ['amount'],
        where: {
          deleted: 0
        },
        required: false
      }]
    }).then(data => {
      var new_data = data.map(customer => {
        var _customer$customer_in, _customer$customer_re;
        return _objectSpread(_objectSpread({}, customer.toJSON()), {}, {
          credit: customer === null || customer === void 0 || (_customer$customer_in = customer.customer_invoices) === null || _customer$customer_in === void 0 ? void 0 : _customer$customer_in.reduce((sum, invoice) => sum + invoice.dataValues.amount, 0),
          debit: customer === null || customer === void 0 || (_customer$customer_re = customer.customer_receipts) === null || _customer$customer_re === void 0 ? void 0 : _customer$customer_re.reduce((sum, receipt) => sum + receipt.dataValues.amount, 0)
        });
      });
      res.json({
        customers: new_data
      });
    }).catch(error => {
      res.status(404).send(error);
    });
  } else {
    res.status(200).json({
      customers: []
    });
  }
});
API.get('/customers-pending/:_sid', (req, res) => {
  var _req$user_token_data2;
  var date = req.query.date;
  var _sid = req.params._sid;
  if (req !== null && req !== void 0 && (_req$user_token_data2 = req.user_token_data) !== null && _req$user_token_data2 !== void 0 && _req$user_token_data2.service_areas.includes(req.params._sid)) {
    _model.Invoice.findAll({
      attributes: ['i_id', 'amount', 'date'],
      where: {
        date: {
          [_db.infox_op.lte]: new Date(date)
        },
        _sid: _sid,
        _rid: null,
        deleted: 0
      },
      include: [{
        model: _model.Customer,
        as: 'customer'
      }],
      order: [['date', 'ASC']]
    }).then(data => {
      var new_data = data.map(invoice => {
        return _objectSpread(_objectSpread({}, invoice.customer.toJSON()), {}, {
          credit: null,
          debit: null,
          date: invoice.date
        });
      });
      res.json({
        customers: new_data
      });
    }).catch(error => {
      res.status(404).send("".concat(error));
    });
  } else {
    res.status(200).json({
      customers: []
    });
  }
});
API.get('/customers/:_sid/:c_id', (req, res) => {
  var _req$user_token_data3;
  if (req !== null && req !== void 0 && (_req$user_token_data3 = req.user_token_data) !== null && _req$user_token_data3 !== void 0 && _req$user_token_data3.service_areas.includes(req.params._sid)) {
    _model.Customer.findOne({
      where: {
        _sid: req.params._sid,
        c_id: req.params.c_id
      },
      include: [{
        model: _model.Invoice,
        as: 'customer_invoices',
        where: {
          deleted: 0
        },
        required: false
      }, {
        model: _model.Receipt,
        as: 'customer_receipts',
        where: {
          deleted: 0
        },
        required: false
      }]
    }).then(customer => {
      var _customer$customer_in2, _customer$customer_re2;
      var new_data = _objectSpread(_objectSpread({}, customer.dataValues), {}, {
        credit: customer === null || customer === void 0 || (_customer$customer_in2 = customer.customer_invoices) === null || _customer$customer_in2 === void 0 ? void 0 : _customer$customer_in2.reduce((sum, invoice) => sum + invoice.dataValues.amount, 0),
        debit: customer === null || customer === void 0 || (_customer$customer_re2 = customer.customer_receipts) === null || _customer$customer_re2 === void 0 ? void 0 : _customer$customer_re2.reduce((sum, receipt) => sum + receipt.dataValues.amount, 0)
      });
      res.json(new_data);
    }).catch(error => {
      res.status(404).send("".concat(error));
    });
  } else {
    res.status(200).json({});
  }
});
API.get('/customers-collection/:_sid', (req, res) => {
  var _req$user_token_data4;
  var date = req.query.date;
  var _sid = req.params._sid;
  if (req !== null && req !== void 0 && (_req$user_token_data4 = req.user_token_data) !== null && _req$user_token_data4 !== void 0 && _req$user_token_data4.service_areas.includes(req.params._sid)) {
    _model.Receipt.findAll({
      attributes: ['r_id', 'amount'],
      where: {
        date: {
          [_db.infox_op.eq]: new Date(date)
        },
        _sid: _sid,
        deleted: 0
      },
      include: [{
        model: _model.Customer,
        as: 'customer'
      }]
    }).then(data => {
      var new_data = data.map(receipt => {
        return _objectSpread(_objectSpread({}, receipt.customer.toJSON()), {}, {
          credit: 0,
          debit: receipt.amount
        });
      });
      res.json({
        customers: new_data
      });
    }).catch(error => {
      res.status(404).send("".concat(error));
    });
  } else {
    res.status(200).json({
      customers: []
    });
  }
});
API.get('/edit-customer/:_sid/:c_id', (req, res) => {
  var _req$user_token_data5;
  if (req !== null && req !== void 0 && (_req$user_token_data5 = req.user_token_data) !== null && _req$user_token_data5 !== void 0 && _req$user_token_data5.service_areas.includes(req.params._sid)) {
    _model.Customer.findOne({
      attributes: ['c_id', 'name', 'address', 'contact_no', 'whatsapp_no'],
      where: {
        _sid: req.params._sid,
        c_id: req.params.c_id
      }
    }).then(customer => {
      if (customer) {
        res.json(customer);
      }
    }).catch(err => {
      res.status(404).send("".concat(err));
    });
  }
});
API.put('/edit-customer/:_sid/:c_id', (req, res) => {
  var _req$user_token_data6;
  var {
    name,
    address,
    contact_no,
    whatsapp_no
  } = req.body;
  if (req !== null && req !== void 0 && (_req$user_token_data6 = req.user_token_data) !== null && _req$user_token_data6 !== void 0 && _req$user_token_data6.service_areas.includes(req.params._sid)) {
    _model.Customer.update({
      name: name,
      address: address,
      contact_no: contact_no,
      whatsapp_no: whatsapp_no
    }, {
      where: {
        _sid: req.params._sid,
        c_id: req.params.c_id
      }
    }).then(result => {
      if (result[0] > 0) {
        res.json({
          message: 'Customer updated successfully'
        });
      } else {
        res.status(404).send('Customer not found');
      }
    }).catch(err => {
      res.status(500).send("".concat(err));
    });
  }
});
API.post('/add-customer/:_sid', (req, res) => {
  var _req$user_token_data7;
  var {
    name,
    address,
    contact_no,
    whatsapp_no
  } = req.body;
  if (req !== null && req !== void 0 && (_req$user_token_data7 = req.user_token_data) !== null && _req$user_token_data7 !== void 0 && _req$user_token_data7.service_areas.includes(req.params._sid)) {
    _model.Customer.create({
      name: name,
      address: address,
      contact_no: contact_no,
      whatsapp_no: whatsapp_no,
      _sid: req.params._sid
    }).then(newCustomer => {
      res.json(newCustomer);
    }).catch(err => {
      res.status(500).send("".concat(err));
    });
  } else {
    res.status(403).send('Unauthorized service area');
  }
});
API.get('/income', (req, res) => {});
API.post('/income', (req, res) => {});
API.get('/expense', (req, res) => {});
API.post('/expense', (req, res) => {});
API.use("/*", function (req, res, next) {
  res.status(404).json({
    error: 404
  });
});
var _default = exports.default = API;