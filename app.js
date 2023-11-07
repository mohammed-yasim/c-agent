"use strict";

var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
var _cors = _interopRequireDefault(require("cors"));
var _db = require("./app_api/etc/db");
var _model = require("./app_api/model");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use('/app/', _express.default.static(_path.default.join(__dirname, '/app_vite')));
app.get('/app/*', (req, res) => {
  res.sendFile(_path.default.join(__dirname, '/app_vite/index.html'));
});
app.get('/', (request, response) => {
  var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  response.redirect("/app?ip=".concat(encodeURI(ip)));
});
app.get('/sync', (req, res) => {
  _db.infox_db.sync({
    force: true
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
app.listen(3001), () => {
  console.log("API runing on Port 3001");
};