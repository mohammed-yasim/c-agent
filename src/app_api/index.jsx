import { Router } from "express";
import { ServiceArea, User } from "./model";

const API = Router();


API.get('/', (r, s) => { s.status(200).json({ status: 'OK' }) });

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
    }).then(data => { res.json(data) }).catch(error => {
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

API.use("/*", function (req, res, next) {
    res.status(404).json({ error: 404 });
})

export default API;
