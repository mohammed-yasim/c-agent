import { Router } from "express";
import { ServiceArea, User } from "./model";
import * as jwt from 'jsonwebtoken';

const API = Router();

API.get('/', (r, s) => { s.status(200).json({ status: 'OK' }) });

const secretKey = "ABC_secret";

API.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check the username and password (e.g., with bcrypt)
    // If they are correct, generate a JWT token
    if (username === 'user' && password === 'password') {
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
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
    ServiceArea.findOne({
        where: {
            s_id: _sid
        }
    })
        .then(data => { res.json(data) })
        .catch(error => { res.status(404).send(error) })
})

API.use("/*", function (req, res, next) {
    res.status(404).json({ error: 404 });
})

export default API;
