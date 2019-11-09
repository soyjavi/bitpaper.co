import { CronJob } from 'cron';

import transactions from './transactions';

const DEFAULTS = { runOnInit: true, start: true, timeZone: 'Europe/London' };
const crons = {};

const start = () => {
  crons.transactions = new CronJob({ cronTime: '*/5 * * * *', onTick: transactions, ...DEFAULTS });

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
