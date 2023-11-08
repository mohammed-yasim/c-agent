"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _model = require("./model");
var API = (0, _express.Router)();
API.get('/', (r, s) => {
  s.status(200).json({
    status: 'OK'
  });
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
    res.json(data);
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
API.use("/*", function (req, res, next) {
  res.status(404).json({
    error: 404
  });
});
var _default = exports.default = API;