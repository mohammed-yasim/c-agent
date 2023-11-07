import express from 'express';
import path from 'path'
import cors from 'cors';
import {infox_db} from './app_api/etc/db';
import { Configuration } from './app_api/etc/db/model';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/app/', express.static(path.join(__dirname, '/app_vite')));
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/app_vite/index.html'));
});
app.get('/', (request, response) => {
    let ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    response.redirect(`/app?ip=${encodeURI(ip)}`);
});
app.get('/sync', (req, res) => {
    infox_db.sync().then((data) => {
        res.send('Synced');
    }, (err) => {
        res.send(`${err}`);
    });
});
app.get('/test',(req,res)=>{
    Configuration.findAll((data)=>{
        res.json(data);
    })
})
app.listen(3001), () => {
    console.log("API runing on Port 3001");
};