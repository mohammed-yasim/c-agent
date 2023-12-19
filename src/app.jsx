import express from 'express';
import path from 'path'
import cors from 'cors';
import {infox_db} from './app_api/etc/db';
import { Configuration } from './app_api/model';
import API from './app_api';
const app = express();
app.use(cors());
app.use(express.json());

// app.get('/', (request, response) => {
//     let ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
//     response.redirect(`/app?ip=${encodeURI(ip)}`);
// });
app.use('/api',API);
app.get('/sync', (req, res) => {
    infox_db.sync({force:false}).then((data) => {
        res.send('Synced');
    }, (err) => {
        res.send(`${err}`);
    });
});
app.get('/test',(req,res)=>{
    Configuration.findAll({where:{q:'e'}}).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.status(404).send(`${err}`);
    });
});

app.use('/', express.static(path.join(__dirname, '/app_vite')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/app_vite/index.html'));
});
app.listen(3001), () => {
    console.log("API runing on Port 3001");
};