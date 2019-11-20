import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import cookierParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import crons from './src/crons';
import services from './src/services';
import views from './src/views';
import { error, request } from './src/server/middlewares';

dotenv.config();
const { DOMAIN, PORT = 3000 } = process.env;

const app = express();
const server = http.createServer(app);

// -- Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(cookierParser());
// -- Statics
app.use('/static', express.static('public'));
app.use(express.static('dist'));
// -- App
app.use(request);
app.use('/api', services);
app.use('/', views);
app.use(error);

const listener = server.listen(PORT, () => {
  crons.start();
  console.log(`${DOMAIN} is ready on port ${listener.address().port}`);
});

['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
  process.on(eventType, () => {
    process.exit();
  });
});
