import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import { C } from '../common';
import cache from '../common/cache';
import render from '../common/render';

dotenv.config();
const { SECRET: secret } = process.env;
const { STATE, STORE } = C;

export default ({ originalUrl, session, props: { id } }, res) => {
  if (!session) res.redirect('/');

  const isNew = id === 'new';

  if (!isNew) {
    const user = new Storage({ filename: session.username, secret });
    const invoice = user.get('invoices').findOne({ id });
    if (!invoice) return res.redirect('/');
    if (invoice.state === STATE.CONFIRMED) return res.redirect(`/invoice/${id}/preview`);
  }

  const { xpub = '', address = '' } = session;
  const title = isNew ? 'New Invoice' : `Invoice: ${id}`;
  const store = new Storage(STORE.CURRENCIES);
  const rates = store.get('rates').value;

  return res.send(
    cache.set(originalUrl,
      render('index', {
        page: 'invoice',
        id,
        content: render('invoice', {
          title,
          address: xpub.length === 0 && address.length === 0,
          rates: JSON.stringify(rates),
        }),
        scripts: ['invoice'],
      })),
  );
};
