import Storage from 'vanilla-storage';

import { C } from '../common';
import updateInvoiceTx from '../common/updateInvoiceTx';

const { STATE, STORE } = C;
const HEADER = '[🤖:transactions]';

export default () => {
  const users = new Storage(STORE.USERS);

  let store;
  users.get('active').value.forEach(({ username }) => {
    store = new Storage({ filename: username });
    const invoices = store.get('invoices').find({ state: STATE.PUBLISHED }) || [];

    invoices
      .filter(({ tx = {} }) => !tx.id || !tx.confirmed)
      .forEach(async (invoice) => {
        console.log(`🔎 ${HEADER} fetching invoice ${username}/${invoice.id}...`);

        await updateInvoiceTx(username, invoice);
      });
  });
};
