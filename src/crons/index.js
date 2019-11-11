import { CronJob } from 'cron';

import transactions from './transactions';
import currencies from './currencies';

const DEFAULTS = { runOnInit: true, start: true, timeZone: 'Europe/London' };
const crons = {};

const start = () => {
  crons.transactions = new CronJob({ cronTime: '*/5 * * * *', onTick: transactions, ...DEFAULTS });
  crons.currencies = new CronJob({ cronTime: '*/30 * * * *', onTick: currencies, ...DEFAULTS });

  return crons;
};

const stop = () => {
  Object.keys(crons).forEach((cron) => {
    console.log(`[🤖:${cron}] stopped.`);
    crons[cron].stop();
  });
};

export default {
  start,

  stop,
};
