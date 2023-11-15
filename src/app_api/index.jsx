import { Router } from "express";
import { Customer, DayBook, ServiceArea, User } from "./model";
import * as jwt from 'jsonwebtoken';
import { infox_sequlize } from "./etc/db";

const API = Router();

API.get('/', (r, s) => { s.status(200).json({ status: 'OK' }) });

const secretKey = "ABC_secret";

API.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check the username and password (e.g., with bcrypt)
    // If they are correct, generate a JWT token
    if (username === 'user@domain.tld' && password === 'password') {
        let data = {}
        data['dXNlcg'] = new Buffer.from('8dd9e64e-7e02-11ee-acae-5405dbe7a86c').toString('base64');
        const token = jwt.sign(data, secretKey, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

API.use((req, res, next) => {
    let token = req.headers.authorization || false
    if (token) {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                console.error('JWT Verification Error:', error.message);
                res.status(401).send('error');
            } else {
                // console.log('Decoded JWT Payload:', decoded);
                req.user_data = decoded;
                req._uid = Buffer.from(decoded.dXNlcg, 'base64').toString('utf-8');
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
    User.findOne({
        where: {
        }, include: [
            {
                model: ServiceArea,
                through: { attributes: [] },
            },
            // { model: ServiceArea, as: 'serviceareas' }
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

API.get('/service_areas', (req, res) => {
    User.findOne({
        where: {
        }, include: [
            { model: ServiceArea, as: 'serviceareas' }
        ]
    }).then(data => { res.json(data) }).catch(error => {
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
                u_id: req._uid
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
    Promise.all([service_area, balance, customers])
        .then(data => {
            res.json({
                date: date,
                service_area: data[0],
                balance: data[1],
                customers: data[2],
                u_id: req._uid
            })
        })
        .catch(error => { res.status(404).send(error) })
})

API.get('/income', (req, res) => { });
API.post('/income', (req, res) => { });
API.get('/expense', (req, res) => { });
API.post('/expense', (req, res) => { });

API.use("/*", function (req, res, next) {
    res.status(404).json({ error: 404 });
})

export default API;
