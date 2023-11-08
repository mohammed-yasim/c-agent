"use strict";

require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _model = require("./model");
var jwt = _interopRequireWildcard(require("jsonwebtoken"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
  if (username === 'user' && password === 'password') {
    var token = jwt.sign({
      username
    }, secretKey, {
      expiresIn: '1h'
    });
    res.json({
      token
    });
  } else {
    res.status(401).send('Invalid credentials');
  }
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
  _model.ServiceArea.findOne({
    where: {
      s_id: _sid
    }
  }).then(data => {
    res.json(data);
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