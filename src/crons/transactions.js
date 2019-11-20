import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import { C } from '../common';
import updateInvoiceTx from '../common/updateInvoiceTx';

dotenv.config();
const { SECRET: secret } = process.env;
const { STATE, STORE } = C;
const HEADER = '[🤖:transactions]';

export default () => {
  const users = new Storage({ ...STORE.DB, secret });

  let store;
  users.get('users').value.forEach(({ username }) => {
    store = new Storage({ filename: username, secret });
    const invoices = store.get('invoices').find({ state: STATE.PUBLISHED }) || [];

    invoices
      .filter(({ tx = {} }) => !tx.id || !tx.confirmed)
      .forEach(async (invoice) => {
        console.log(`🔎 ${HEADER} fetching invoice ${username}/${invoice.id}...`);

        await updateInvoiceTx(username, invoice);
      });
  });
};
