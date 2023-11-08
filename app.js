"use strict";

var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
var _cors = _interopRequireDefault(require("cors"));
var _db = require("./app_api/etc/db");
var _model = require("./app_api/model");
var _app_api = _interopRequireDefault(require("./app_api"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use('/api', _app_api.default);
app.get('/sync', (req, res) => {
  _db.infox_db.sync({
    force: false
  }).then(data => {
    res.send('Synced');
  }, err => {
    res.send("".concat(err));
  });
});
app.get('/test', (req, res) => {
  _model.Configuration.findAll(data => {
    res.json(data);
  });
});
app.use('/', _express.default.static(_path.default.join(__dirname, '/app_vite')));
app.get('/*', (req, res) => {
  res.sendFile(_path.default.join(__dirname, '/app_vite/index.html'));
});
app.listen(3001), () => {
  console.log("API runing on Port 3001");
};