import { Router } from "express";
import { Customer, DayBook, Invoice, Receipt, ServiceArea, User } from "./model";
import * as jwt from 'jsonwebtoken';
import { infox_op, infox_sequlize } from "./etc/db";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const API = Router();

function generateRandomHash() {
    const randomBytes = crypto.randomBytes(3); // 3 bytes will give you 6 hexadecimal characters
    const randomHash = randomBytes.toString('HEX').toLowerCase(); // Convert to uppercase for consistency
    return randomHash;
}

API.get('/', (r, s) => { s.status(200).json({ status: 'OK' }) });

const secretKey = "ABC_secret";

// const secretKey = crypto.randomBytes(32).toString('base64');

API.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({
        where: { email: username, active: 1, suspended: 0 },
        include: [
            {
                model: ServiceArea,
                through: { attributes: [] },
                attributes: ['s_id']
            },
        ]
    }).then(
        (user) => {
            if (user) {
                bcrypt.compare(password, user.passwd, (error, match) => {
                    if (error) {
                        res.status(406).send(`invalid credentials,${error}`);
                    } else if (match) {
                        let data = {}
                        data['service_areas'] = user?.ServiceAreas?.map((a) => { return a.s_id });
                        data['dXNlcg'] = new Buffer.from(user.u_id).toString('base64');
                        data['dXNlcg'] = generateRandomHash() + data.dXNlcg + generateRandomHash();
                        const token = jwt.sign(data, secretKey, { expiresIn: '24h' });
                        res.json({ token });
                    } else {
                        res.status(406).send('invalid credentials');
                    }
                })
            }
            else {
                res.status(406).send('inactive/invalid credentials/suspended');
            }
        }
    ).catch(
        (err) => {
            res.status(404).send(`${err}`);
        }
    )
});

API.get('/gen', (req, res) => {
    bcrypt.hash(req.query?.password, 10, (error, hash) => {
        if (error) {
            res.status(500).send(`? ${error}`);
        }
        else {
            res.send(hash)
        }
    });
})

API.use((req, res, next) => {
    let token = req.headers.authorization || false
    if (token) {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                // console.error('JWT Verification Error:', error.message);
                res.status(401).send('error');
            } else {
                // console.log('Decoded JWT Payload:', decoded);
                req.user_token_data = decoded;
                let _uid = String(decoded.dXNlcg).slice(6).slice(0, -6);
                req._uid = Buffer.from(_uid, 'base64').toString('utf-8')
                User.findOne({
                    where: {
                        u_id: req._uid
                    },
                    attributes: ['u_id'],
                    include: [
                        { model: ServiceArea, as: 'serviceareas', attributes: ['s_id'] }
                    ]
                }).then(data => {
                    if (data) {
                        req.user_data = data.serviceareas.map((a) => { return a.s_id });
                        next();
                    } else {
                        res.status(401).send('error');
                    }
                }).catch(error => {
                    res.status(406).send(error)
                })
            }
        });
    } else {
        res.status(401).send('error');
    }
});

// API.use((req, res, next) => {
//     console.log('USER:', req.user_token_data, req.user_data);
//     next();
// });

API.get('/sync', (req, res) => {
    User.findOne({
        where: {
            u_id: req._uid
        },
        attributes: [],
        include: [
            {
                model: ServiceArea,
                through: { attributes: [] },
            },
        ]
    }).then(data => {
        if (data) {
            res.json(data)
        } else {
            res.json({})
        }
    }).catch(error => {
        res.status(404).send(error)
    })
});

API.get('/fetch/:_sid', (req, res) => {
    let _sid = req.params._sid;
    let date = req.query.date
    const balance = new Promise((resolve, reject) => {
        DayBook.findAndCountAll({
            attributes: [
                [infox_sequlize.fn('COALESCE', infox_sequlize.fn('SUM', infox_sequlize.col('creditAmount')), 0), 'credit'],
                [infox_sequlize.fn('COALESCE', infox_sequlize.fn('SUM', infox_sequlize.col('debitAmount')), 0), 'debit'],
            ],
            where: {
                date: new Date(date),
                _sid: _sid,
                _uid: req._uid
            }
        })
            .then(data => {
                let append_data = { credit: 0, debit: 0 };
                if (data?.count > 0) {
                    append_data = data.rows[0].dataValues
                }
                resolve({
                    transactions: data?.count, ...append_data
                })
            })
            .catch(error => reject(error));
    });
    const service_area = new Promise((resolve, reject) => {
        ServiceArea.findOne({
            where: {
                s_id: _sid
            }
        })
            .then(data => resolve(data))
            .catch(error => reject(error));

    });
    const customers = new Promise((resolve, reject) => {
        Customer.count({
            where: {
                _sid: _sid
            }
        }).then(data => resolve(data))
            .catch(error => reject(error));
    })
    const pending = new Promise((resolve, reject) => {
        Invoice.count({
            where: {
                date: new Date(date),
                _sid: _sid,
                _rid: null,
                deleted: 0
            }
        }).then(data => resolve(data))
            .catch(error => reject(error));
    });
    const colllection = new Promise((resolve, reject) => {
        Invoice.count({
            where: {
                date: new Date(date),
                _sid: _sid,
                deleted: 0,
                _rid: { [infox_op.not]: null }
            }
        }).then(data => resolve(data))
            .catch(error => reject(error));
    })
    Promise.all([service_area, balance, customers, pending, colllection])
        .then(data => {
            res.json({
                date: date,
                service_area: data[0],
                balance: data[1],
                customers: data[2],
                pending: data[3],
                collection: data[4],
                u_id: req._uid
            })
        })
        .catch(error => { res.status(404).send(error) })
})

API.get('/customers/:_sid', (req, res) => {
    if (req?.user_token_data?.service_areas.includes(req.params._sid)) {
        Customer.findAll({
            where: {
                _sid: req.params._sid,
            },
            include: [
                {
                    model: Invoice,
                    as: 'invoices',
                    attributes: [
                        [infox_sequlize.fn('COALESCE', infox_sequlize.fn('SUM', infox_sequlize.col('invoices.amount')), 0), 'total'],
                    ],
                    where: { deleted: 0 },
                    required: false,
                    duplicating: false, // Add this option to avoid duplicating customers when both invoices and receipts are present
                },
                {
                    model: Receipt,
                    as: 'receipts',
                    attributes: [
                        [infox_sequlize.fn('COALESCE', infox_sequlize.fn('SUM', infox_sequlize.col('receipts.amount')), 0), 'total'],
                    ],
                    where: { deleted: 0 },
                    required: false,
                },
            ],
            // attributes: ['_cid'], // Add any other attributes you want to select from the Customer model
            group: ['Customer.c_id'],
        }).then((data) => {
            let new_data = data.map((customer) => {
                return {
                    ...customer.toJSON(),
                    invoices: customer.invoices.reduce((sum, invoice) => sum + invoice.dataValues.total, 0),
                    receipts: customer.receipts.reduce((sum, receipt) => sum + receipt.dataValues.total, 0)
                };
            });
            res.json({
                customers: new_data
            })
        })
            .catch(error => { res.status(404).send(error) })
    } else {
        res.status(200).json({ customers: [] })
    }

});
API.get('/income', (req, res) => { });
API.post('/income', (req, res) => { });
API.get('/expense', (req, res) => { });
API.post('/expense', (req, res) => { });
API.use("/*", function (req, res, next) {
    res.status(404).json({ error: 404 });
})

export default API;
