import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/api';

import mongoose from 'mongoose';
import Replay from './models/replay';
mongoose.connect('mongodb://jared:h@ds121483.mlab.com:21483/pogtracker-dev',{
  useMongoClient : true
});

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', router);

app.listen(port, () => {
  console.log('Running on port: ' + 8080);
});
