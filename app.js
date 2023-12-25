"use strict";

require("core-js/modules/es.promise.js");
var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
var _cors = _interopRequireDefault(require("cors"));
var _db = require("./app_api/etc/db");
var _model = require("./app_api/model");
var _app_api = _interopRequireDefault(require("./app_api"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _faker = require("@faker-js/faker");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
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
  _model.Configuration.findAll({
    where: {
      q: 'e'
    }
  }).then(data => {
    res.json(data);
  }).catch(err => {
    res.status(404).send("".concat(err));
  });
});
app.get('/mock', function () {
  var _ref = _asyncToGenerator(function* (req, res) {
    _db.infox_db.sync({
      force: true
    }).then(data => {
      _db.infox_db.query("\n        CREATE TRIGGER before_invoice_insert\n        BEFORE INSERT ON invoices\n        FOR EACH ROW BEGIN DECLARE nextNo INT;\n        -- Find the current next invoice number for the _sid\n        SELECT MAX(_no) INTO nextNo\n        FROM invoices\n        WHERE _sid = NEW._sid\n        LIMIT 1;\n        -- If the _sid doesn't exist in InvoiceSequence, create a new entry\n        IF nextNo IS NULL THEN\n        SET nextNo = 1;\n        ELSE\n        -- Update the next invoice number for the _sid\n        SET nextNo = nextNo + 1;\n        END IF;\n        -- Set the generated invoice number for the new invoice\n        SET NEW._no = LPAD(nextNo, 5, '0');\n        END;\n        ").then(data => {
        _db.infox_db.query("CREATE TRIGGER before_receipt_insert\n            BEFORE INSERT ON receipts\n            FOR EACH ROW\n            BEGIN\n                DECLARE nextNo INT;\n                -- Find the current next invoice number for the _sid\n                SELECT MAX(_no) INTO nextNo\n                FROM receipts\n                WHERE _sid = NEW._sid\n                LIMIT 1;\n                -- If the _sid doesn't exist in InvoiceSequence, create a new entry\n                IF nextNo IS NULL THEN\n                SET nextNo = 1;\n                ELSE\n                -- Update the next invoice number for the _sid\n                SET nextNo = nextNo + 1;\n                END IF;\n                -- Set the generated invoice number for the new invoice\n                SET NEW._no = LPAD(nextNo, 5, '0');\n                END;\n            ").then(data => {
          _bcryptjs.default.hash('password', 10, (error, hash) => {
            if (error) {
              res.status(500).send("? ".concat(error));
            } else {
              _model.User.create({
                email: 'user@domain.tld',
                passwd: hash,
                u_name: 'User Name',
                u_mob: '0000000000',
                u_profile: {}
              }).then(user => {
                _model.ServiceArea.create({
                  name: 'Erattupetta 1',
                  code: 'SA1',
                  place: 'Place 1',
                  lat: '0.000000',
                  lng: '0.000000',
                  contact_no: '9947002210',
                  contact_name: 'Rasaly',
                  _owner_uid: user.u_id
                }).then(service_area => {
                  user.addServiceArea(service_area);
                  var customer = Array.from({
                    length: 500
                  }, (_, index) => ({
                    name: _faker.faker.person.fullName(),
                    address: _faker.faker.location.streetAddress(),
                    contact_no: _faker.faker.number.int({
                      min: 7000000000,
                      max: 9999999999
                    }),
                    whatsapp_no: _faker.faker.number.int({
                      min: 7000000000,
                      max: 9999999999
                    }),
                    _sid: service_area.s_id
                  }));
                  _model.Customer.bulkCreate(customer).then(customers => {
                    customers.map((customer, index) => {
                      setTimeout(() => {
                        console.log(new Date().getTime());
                        var amount = 200;
                        var date = _faker.faker.date.recent({
                          days: 10
                        });
                        _model.Invoice.create({
                          _type: 'type',
                          _desc: _faker.faker.lorem.sentence(),
                          _no: 0,
                          amount: amount,
                          date: date,
                          _cid: customer.c_id,
                          _sid: service_area.s_id,
                          _uid: user.u_id
                        }).then(invoice => {
                          _model.Receipt.create({
                            _no: _faker.faker.finance.iban(),
                            _type: 'type',
                            _desc: _faker.faker.lorem.sentence(),
                            amount: amount,
                            date: date,
                            _cid: customer.c_id,
                            _sid: service_area.s_id,
                            _uid: user.u_id,
                            _iid: invoice.i_id
                          }).then(receipt => {
                            _model.Daybook.create({
                              referenceNumber: _faker.faker.finance.iban(),
                              date: receipt.date,
                              description: _faker.faker.lorem.sentence(),
                              debitAmount: 0,
                              creditAmount: receipt.amount,
                              accountName: _faker.faker.finance.accountName(),
                              notes: _faker.faker.lorem.paragraph(),
                              _cid: customer.c_id,
                              _sid: service_area.s_id,
                              _uid: user.u_id
                            }).then(daybook => {
                              _model.Invoice.update({
                                _rid: receipt.r_id
                              }, {
                                where: {
                                  i_id: invoice.i_id
                                }
                              }).then(data => {
                                console.log(data);
                                _model.Invoice.create({
                                  _type: 'type',
                                  _desc: _faker.faker.lorem.sentence(),
                                  _no: 0,
                                  amount: 200,
                                  date: _faker.faker.date.recent({
                                    days: 3
                                  }),
                                  _cid: customer.c_id,
                                  _sid: service_area.s_id,
                                  _uid: user.u_id
                                });
                              }).catch(err => {
                                console.log(err);
                              });
                            });
                          });
                        });
                      }, 500 * index + 1);
                      setTimeout(() => {
                        console.log(new Date().getTime());
                        var amount = 200;
                        var date = _faker.faker.date.recent({
                          days: 10
                        });
                        _model.Invoice.create({
                          _type: 'type',
                          _desc: _faker.faker.lorem.sentence(),
                          _no: 0,
                          amount: amount,
                          date: date,
                          _cid: customer.c_id,
                          _sid: service_area.s_id,
                          _uid: user.u_id
                        }).then(invoice => {
                          _model.Receipt.create({
                            _no: _faker.faker.finance.iban(),
                            _type: 'type',
                            _desc: _faker.faker.lorem.sentence(),
                            amount: amount,
                            date: date,
                            _cid: customer.c_id,
                            _sid: service_area.s_id,
                            _uid: user.u_id,
                            _iid: invoice.i_id
                          }).then(receipt => {
                            _model.Daybook.create({
                              referenceNumber: _faker.faker.finance.iban(),
                              date: receipt.date,
                              description: _faker.faker.lorem.sentence(),
                              debitAmount: 0,
                              creditAmount: receipt.amount,
                              accountName: _faker.faker.finance.accountName(),
                              notes: _faker.faker.lorem.paragraph(),
                              _cid: customer.c_id,
                              _sid: service_area.s_id,
                              _uid: user.u_id
                            }).then(daybook => {
                              _model.Invoice.update({
                                _rid: receipt.r_id
                              }, {
                                where: {
                                  i_id: invoice.i_id
                                }
                              }).then(data => {
                                console.log(data);
                                _model.Invoice.create({
                                  _type: 'type',
                                  _desc: _faker.faker.lorem.sentence(),
                                  _no: 0,
                                  amount: 200,
                                  date: _faker.faker.date.recent({
                                    days: 3
                                  }),
                                  _cid: customer.c_id,
                                  _sid: service_area.s_id,
                                  _uid: user.u_id
                                });
                              }).catch(err => {
                                console.log(err);
                              });
                            });
                          });
                        });
                      }, 600 * index + 1);
                      setTimeout(() => {
                        console.log(new Date().getTime());
                        var amount = 200;
                        var date = _faker.faker.date.recent({
                          days: 10
                        });
                        _model.Invoice.create({
                          _type: 'type',
                          _desc: _faker.faker.lorem.sentence(),
                          _no: 0,
                          amount: amount,
                          date: date,
                          _cid: customer.c_id,
                          _sid: service_area.s_id,
                          _uid: user.u_id
                        }).then(invoice => {
                          _model.Receipt.create({
                            _no: _faker.faker.finance.iban(),
                            _type: 'type',
                            _desc: _faker.faker.lorem.sentence(),
                            amount: amount,
                            date: date,
                            _cid: customer.c_id,
                            _sid: service_area.s_id,
                            _uid: user.u_id,
                            _iid: invoice.i_id
                          }).then(receipt => {
                            _model.Daybook.create({
                              referenceNumber: _faker.faker.finance.iban(),
                              date: receipt.date,
                              description: _faker.faker.lorem.sentence(),
                              debitAmount: 0,
                              creditAmount: receipt.amount,
                              accountName: _faker.faker.finance.accountName(),
                              notes: _faker.faker.lorem.paragraph(),
                              _cid: customer.c_id,
                              _sid: service_area.s_id,
                              _uid: user.u_id
                            }).then(daybook => {
                              _model.Invoice.update({
                                _rid: receipt.r_id
                              }, {
                                where: {
                                  i_id: invoice.i_id
                                }
                              }).then(data => {
                                console.log(data);
                                _model.Invoice.create({
                                  _type: 'type',
                                  _desc: _faker.faker.lorem.sentence(),
                                  _no: 0,
                                  amount: 200,
                                  date: _faker.faker.date.recent({
                                    days: 3
                                  }),
                                  _cid: customer.c_id,
                                  _sid: service_area.s_id,
                                  _uid: user.u_id
                                });
                              }).catch(err => {
                                console.log(err);
                              });
                            });
                          });
                        });
                      }, 700 * index + 1);
                      setTimeout(() => {
                        console.log(new Date().getTime());
                        var amount = 200;
                        var date = _faker.faker.date.recent({
                          days: 10
                        });
                        _model.Invoice.create({
                          _type: 'type',
                          _desc: _faker.faker.lorem.sentence(),
                          _no: 0,
                          amount: amount,
                          date: date,
                          _cid: customer.c_id,
                          _sid: service_area.s_id,
                          _uid: user.u_id
                        }).then(invoice => {
                          _model.Receipt.create({
                            _no: _faker.faker.finance.iban(),
                            _type: 'type',
                            _desc: _faker.faker.lorem.sentence(),
                            amount: amount,
                            date: date,
                            _cid: customer.c_id,
                            _sid: service_area.s_id,
                            _uid: user.u_id,
                            _iid: invoice.i_id
                          }).then(receipt => {
                            _model.Daybook.create({
                              referenceNumber: _faker.faker.finance.iban(),
                              date: receipt.date,
                              description: _faker.faker.lorem.sentence(),
                              debitAmount: 0,
                              creditAmount: receipt.amount,
                              accountName: _faker.faker.finance.accountName(),
                              notes: _faker.faker.lorem.paragraph(),
                              _cid: customer.c_id,
                              _sid: service_area.s_id,
                              _uid: user.u_id
                            }).then(daybook => {
                              _model.Invoice.update({
                                _rid: receipt.r_id
                              }, {
                                where: {
                                  i_id: invoice.i_id
                                }
                              }).then(data => {
                                console.log(data);
                                _model.Invoice.create({
                                  _type: 'type',
                                  _desc: _faker.faker.lorem.sentence(),
                                  _no: 0,
                                  amount: 200,
                                  date: _faker.faker.date.recent({
                                    days: 3
                                  }),
                                  _cid: customer.c_id,
                                  _sid: service_area.s_id,
                                  _uid: user.u_id
                                });
                              }).catch(err => {
                                console.log(err);
                              });
                            });
                          });
                        });
                      }, 800 * index + 1);
                      setTimeout(() => {
                        console.log(new Date().getTime());
                        var amount = 200;
                        var date = _faker.faker.date.recent({
                          days: 10
                        });
                        _model.Invoice.create({
                          _type: 'type',
                          _desc: _faker.faker.lorem.sentence(),
                          _no: 0,
                          amount: amount,
                          date: date,
                          _cid: customer.c_id,
                          _sid: service_area.s_id,
                          _uid: user.u_id
                        }).then(invoice => {
                          _model.Receipt.create({
                            _no: _faker.faker.finance.iban(),
                            _type: 'type',
                            _desc: _faker.faker.lorem.sentence(),
                            amount: amount,
                            date: date,
                            _cid: customer.c_id,
                            _sid: service_area.s_id,
                            _uid: user.u_id,
                            _iid: invoice.i_id
                          }).then(receipt => {
                            _model.Daybook.create({
                              referenceNumber: _faker.faker.finance.iban(),
                              date: receipt.date,
                              description: _faker.faker.lorem.sentence(),
                              debitAmount: 0,
                              creditAmount: receipt.amount,
                              accountName: _faker.faker.finance.accountName(),
                              notes: _faker.faker.lorem.paragraph(),
                              _cid: customer.c_id,
                              _sid: service_area.s_id,
                              _uid: user.u_id
                            }).then(daybook => {
                              _model.Invoice.update({
                                _rid: receipt.r_id
                              }, {
                                where: {
                                  i_id: invoice.i_id
                                }
                              }).then(data => {
                                console.log(data);
                                _model.Invoice.create({
                                  _type: 'type',
                                  _desc: _faker.faker.lorem.sentence(),
                                  _no: 0,
                                  amount: 200,
                                  date: _faker.faker.date.recent({
                                    days: 3
                                  }),
                                  _cid: customer.c_id,
                                  _sid: service_area.s_id,
                                  _uid: user.u_id
                                });
                              }).catch(err => {
                                console.log(err);
                              });
                            });
                          });
                        });
                      }, 900 * index + 1);
                      setTimeout(() => {
                        console.log(new Date().getTime());
                        var amount = 200;
                        var date = _faker.faker.date.recent({
                          days: 10
                        });
                        _model.Invoice.create({
                          _type: 'type',
                          _desc: _faker.faker.lorem.sentence(),
                          _no: 0,
                          amount: amount,
                          date: date,
                          _cid: customer.c_id,
                          _sid: service_area.s_id,
                          _uid: user.u_id
                        }).then(invoice => {
                          _model.Receipt.create({
                            _no: _faker.faker.finance.iban(),
                            _type: 'type',
                            _desc: _faker.faker.lorem.sentence(),
                            amount: amount,
                            date: date,
                            _cid: customer.c_id,
                            _sid: service_area.s_id,
                            _uid: user.u_id,
                            _iid: invoice.i_id
                          }).then(receipt => {
                            _model.Daybook.create({
                              referenceNumber: _faker.faker.finance.iban(),
                              date: receipt.date,
                              description: _faker.faker.lorem.sentence(),
                              debitAmount: 0,
                              creditAmount: receipt.amount,
                              accountName: _faker.faker.finance.accountName(),
                              notes: _faker.faker.lorem.paragraph(),
                              _cid: customer.c_id,
                              _sid: service_area.s_id,
                              _uid: user.u_id
                            }).then(daybook => {
                              _model.Invoice.update({
                                _rid: receipt.r_id
                              }, {
                                where: {
                                  i_id: invoice.i_id
                                }
                              }).then(data => {
                                console.log(data);
                                _model.Invoice.create({
                                  _type: 'type',
                                  _desc: _faker.faker.lorem.sentence(),
                                  _no: 0,
                                  amount: 200,
                                  date: _faker.faker.date.recent({
                                    days: 3
                                  }),
                                  _cid: customer.c_id,
                                  _sid: service_area.s_id,
                                  _uid: user.u_id
                                });
                              }).catch(err => {
                                console.log(err);
                              });
                            });
                          });
                        });
                      }, 1000 * index + 1);
                      setTimeout(() => {
                        console.log(new Date().getTime());
                        var amount = 200;
                        var date = _faker.faker.date.recent({
                          days: 10
                        });
                        _model.Invoice.create({
                          _type: 'type',
                          _desc: _faker.faker.lorem.sentence(),
                          _no: 0,
                          amount: amount,
                          date: date,
                          _cid: customer.c_id,
                          _sid: service_area.s_id,
                          _uid: user.u_id
                        }).then(invoice => {
                          _model.Receipt.create({
                            _no: _faker.faker.finance.iban(),
                            _type: 'type',
                            _desc: _faker.faker.lorem.sentence(),
                            amount: amount,
                            date: date,
                            _cid: customer.c_id,
                            _sid: service_area.s_id,
                            _uid: user.u_id,
                            _iid: invoice.i_id
                          }).then(receipt => {
                            _model.Daybook.create({
                              referenceNumber: _faker.faker.finance.iban(),
                              date: receipt.date,
                              description: _faker.faker.lorem.sentence(),
                              debitAmount: 0,
                              creditAmount: receipt.amount,
                              accountName: _faker.faker.finance.accountName(),
                              notes: _faker.faker.lorem.paragraph(),
                              _cid: customer.c_id,
                              _sid: service_area.s_id,
                              _uid: user.u_id
                            }).then(daybook => {
                              _model.Invoice.update({
                                _rid: receipt.r_id
                              }, {
                                where: {
                                  i_id: invoice.i_id
                                }
                              }).then(data => {
                                console.log(data);
                                _model.Invoice.create({
                                  _type: 'type',
                                  _desc: _faker.faker.lorem.sentence(),
                                  _no: 0,
                                  amount: 200,
                                  date: _faker.faker.date.recent({
                                    days: 3
                                  }),
                                  _cid: customer.c_id,
                                  _sid: service_area.s_id,
                                  _uid: user.u_id
                                });
                              }).catch(err => {
                                console.log(err);
                              });
                            });
                          });
                        });
                      }, 100 * index + 1);
                      setTimeout(() => {
                        console.log(new Date().getTime());
                        var amount = 200;
                        var date = _faker.faker.date.recent({
                          days: 10
                        });
                        _model.Invoice.create({
                          _type: 'type',
                          _desc: _faker.faker.lorem.sentence(),
                          _no: 0,
                          amount: amount,
                          date: date,
                          _cid: customer.c_id,
                          _sid: service_area.s_id,
                          _uid: user.u_id
                        }).then(invoice => {
                          _model.Receipt.create({
                            _no: _faker.faker.finance.iban(),
                            _type: 'type',
                            _desc: _faker.faker.lorem.sentence(),
                            amount: amount,
                            date: date,
                            _cid: customer.c_id,
                            _sid: service_area.s_id,
                            _uid: user.u_id,
                            _iid: invoice.i_id
                          }).then(receipt => {
                            _model.Daybook.create({
                              referenceNumber: _faker.faker.finance.iban(),
                              date: receipt.date,
                              description: _faker.faker.lorem.sentence(),
                              debitAmount: 0,
                              creditAmount: receipt.amount,
                              accountName: _faker.faker.finance.accountName(),
                              notes: _faker.faker.lorem.paragraph(),
                              _cid: customer.c_id,
                              _sid: service_area.s_id,
                              _uid: user.u_id
                            }).then(daybook => {
                              _model.Invoice.update({
                                _rid: receipt.r_id
                              }, {
                                where: {
                                  i_id: invoice.i_id
                                }
                              }).then(data => {
                                console.log(data);
                                _model.Invoice.create({
                                  _type: 'type',
                                  _desc: _faker.faker.lorem.sentence(),
                                  _no: 0,
                                  amount: 200,
                                  date: _faker.faker.date.recent({
                                    days: 3
                                  }),
                                  _cid: customer.c_id,
                                  _sid: service_area.s_id,
                                  _uid: user.u_id
                                });
                              }).catch(err => {
                                console.log(err);
                              });
                            });
                          });
                        });
                      }, 1200 * index + 1);
                    });
                  });
                });
              });
            }
          });
        });
      });
      res.send('Synced');
    }, err => {
      res.send("".concat(err));
    });
  });
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.use('/', _express.default.static(_path.default.join(__dirname, '/app_vite')));
app.get('/*', (req, res) => {
  res.sendFile(_path.default.join(__dirname, '/app_vite/index.html'));
});
app.listen(3001), () => {
  console.log("API runing on Port 3001");
};