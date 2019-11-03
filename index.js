import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import cookierParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import { C } from './src/common';
import services from './src/services';
import pages from './src/pages';
import { error, request } from './src/middlewares';

dotenv.config();
const { PORT = 3000 } = process.env;

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
app.use('/', pages);
app.use(error);

const listener = server.listen(PORT, () => {
  console.log(`${C.DOMAIN} is ready on port ${listener.address().port}`);
});

['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'].forEach((eventType) => {
  process.on(eventType, () => {
    process.exit();
  });
});
