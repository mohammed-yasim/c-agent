import { Router } from "express";
import { Customer, Daybook, Invoice, Receipt, ServiceArea, User } from "./model";
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
        Daybook.findAndCountAll({
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
                _sid: _sid,
                createdAt: { [infox_op.lte]: new Date(date).setHours(23, 59, 59, 999) },
                active: 1,
            }
        }).then(data => resolve(data))
            .catch(error => reject(error));
    })
    const pending = new Promise((resolve, reject) => {
        Invoice.count({
            where: {
                date: { [infox_op.lte]: new Date(date).setHours(23, 59, 59, 999) },
                _sid: _sid,
                _rid: null,
                deleted: 0
            }
        }).then(data => resolve(data))
            .catch(error => reject(error));
    });
    const colllection = new Promise((resolve, reject) => {
        Receipt.count({
            where: {
                date: new Date(date),
                _sid: _sid,
                _uid: req._uid,
                deleted: 0,
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
                    as: 'customer_invoices',
                    // attributes: [
                    //     [infox_sequlize.fn('COALESCE', infox_sequlize.fn('SUM', infox_sequlize.col('customer_invoices.amount')), 0), 'credit'],
                    // ],
                    attributes: ['amount'],
                    where: { deleted: 0 },
                    required: false,
                    // duplicating: false, // Add this option to avoid duplicating customers when both invoices and receipts are present
                },
                {
                    model: Receipt,
                    as: 'customer_receipts',
                    // attributes: [
                    //     [infox_sequlize.fn('COALESCE', infox_sequlize.fn('SUM', infox_sequlize.col('customer_receipts.amount')), 0), 'debit'],
                    // ],
                    attributes: ['amount'],
                    where: { deleted: 0 },
                    required: false,
                },
            ],
            // attributes: ['_cid'], // Add any other attributes you want to select from the Customer model
            // group: ['Customer.c_id'],
        }).then((data) => {
            let new_data = data.map((customer) => {
                return {
                    ...customer.toJSON(),
                    credit: customer?.customer_invoices?.reduce((sum, invoice) => sum + invoice.dataValues.amount, 0),
                    debit: customer?.customer_receipts?.reduce((sum, receipt) => sum + receipt.dataValues.amount, 0)
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

API.get('/customers-pending/:_sid', (req, res) => {
    let date = req.query.date
    let _sid = req.params._sid;

    if (req?.user_token_data?.service_areas.includes(req.params._sid)) {

        Invoice.findAll({
            attributes: ['i_id', 'amount', 'date'],
            where: {
                date: { [infox_op.lte]: new Date(date) },
                _sid: _sid,
                _rid: null,
                deleted: 0
            },
            include: [
                {
                    model: Customer,
                    as: 'customer',
                }
            ],
            order: [['date', 'ASC']]
        }).then((data) => {
            let new_data = data.map((invoice) => {
                return {
                    ...invoice.customer.toJSON(),
                    credit: null,
                    debit: null,
                    date: invoice.date,
                };
            });
            res.json({
                customers: new_data
            })
        })
            .catch(error => { res.status(404).send(`${error}`) })
    } else {
        res.status(200).json({ customers: [] })
    }

});

API.get('/customers/:_sid/:c_id', (req, res) => {
    if (req?.user_token_data?.service_areas.includes(req.params._sid)) {
        Customer.findOne({
            where: {
                _sid: req.params._sid,
                c_id: req.params.c_id
            },
            include: [
                {
                    model: Invoice,
                    as: 'customer_invoices',
                    // attributes: [
                    //     [infox_sequlize.fn('COALESCE', infox_sequlize.fn('SUM', infox_sequlize.col('customer_invoices.amount')), 0), 'credit'],
                    // ],
                    where: { deleted: 0 },
                    required: false,
                    // duplicating: false, // Add this option to avoid duplicating customers when both invoices and receipts are present
                },
                {
                    model: Receipt,
                    as: 'customer_receipts',
                    // attributes: [
                    //     [infox_sequlize.fn('COALESCE', infox_sequlize.fn('SUM', infox_sequlize.col('customer_receipts.amount')), 0), 'debit'],
                    // ],
                    where: { deleted: 0 },
                    required: false,
                },
            ],
            // attributes: ['_cid'], // Add any other attributes you want to select from the Customer model
            // group: ['Customer.c_id'],
        }).then((customer) => {
            let new_data = {
                ...customer.dataValues,
                credit: customer?.customer_invoices?.reduce((sum, invoice) => sum + invoice.dataValues.amount, 0),
                debit: customer?.customer_receipts?.reduce((sum, receipt) => sum + receipt.dataValues.amount, 0)
            };
            res.json(new_data)
        })
            .catch(error => { res.status(404).send(`${error}`) })
    } else {
        res.status(200).json({})
    }

});

API.get('/customers-collection/:_sid', (req, res) => {
    let date = req.query.date
    let _sid = req.params._sid;

    if (req?.user_token_data?.service_areas.includes(req.params._sid)) {

        Receipt.findAll({
            attributes: ['r_id', 'amount'],
            where: {
                date: { [infox_op.eq]: new Date(date) },
                _sid: _sid,
                deleted: 0
            },
            include: [
                {
                    model: Customer,
                    as: 'customer',
                }
            ]
        }).then((data) => {
            let new_data = data.map((receipt) => {
                return {
                    ...receipt.customer.toJSON(),
                    credit: 0,
                    debit: receipt.amount,
                };
            });
            res.json({
                customers: new_data
            })
        })
            .catch(error => { res.status(404).send(`${error}`) })
    } else {
        res.status(200).json({ customers: [] })
    }

});

API.get('/edit-customer/:_sid/:c_id', (req, res) => {
    if (req?.user_token_data?.service_areas.includes(req.params._sid)) {
        Customer.findOne({
            attributes: ['c_id', 'name', 'address', 'contact_no', 'whatsapp_no'],
            where: {
                _sid: req.params._sid,
                c_id: req.params.c_id,
            },
        }).then((customer) => {
            if (customer) {
                res.json(customer)
            }
        }).catch(err => {
            res.status(404).send(`${err}`)
        })
    }
});
API.put('/edit-customer/:_sid/:c_id', (req, res) => {
    let { name, address, contact_no, whatsapp_no } = req.body;
    if (req?.user_token_data?.service_areas.includes(req.params._sid)) {
        Customer.update(
            {
                name: name,
                address: address,
                contact_no: contact_no,
                whatsapp_no: whatsapp_no,

            }, // assuming the updated data is sent in the request body
            {
                where: {
                    _sid: req.params._sid,
                    c_id: req.params.c_id,
                },
            }
        ).then((result) => {
            if (result[0] > 0) { // if any row was affected
                res.json({ message: 'Customer updated successfully' })
            } else {
                res.status(404).send('Customer not found')
            }
        }).catch(err => {
            res.status(500).send(`${err}`)
        })
    }
});

API.post('/add-customer/:_sid', (req, res) => {
    let { name, address, contact_no, whatsapp_no } = req.body;

    if (req?.user_token_data?.service_areas.includes(req.params._sid)) {
        Customer.create({
            name: name,
            address: address,
            contact_no: contact_no,
            whatsapp_no: whatsapp_no,
            _sid: req.params._sid,
        }).then((newCustomer) => {
            res.json(newCustomer)
        }).catch(err => {
            res.status(500).send(`${err}`)
        })
    } else {
        res.status(403).send('Unauthorized service area')
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
