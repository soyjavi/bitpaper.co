import Storage from 'vanilla-storage';

import { C } from '../common';
import cache from '../common/cache';
import render from '../common/render';

const { STATE } = C;

export default ({ originalUrl, session, props: { id } }, res) => {
  if (!session) res.redirect('/');

  const isNew = id === 'new';

  if (!isNew) {
    const user = new Storage({ filename: session.username });
    const invoice = user.get('invoices').findOne({ id });
    if (!invoice) return res.redirect('/');
    if (invoice.state === STATE.CONFIRMED) return res.redirect(`/invoice/${id}/preview`);
  }

  const title = isNew ? 'New Invoice' : `Invoice: ${id}`;

  return res.send(
    cache.set(originalUrl,
      render('index', {
        page: 'invoice',
        id,
        content: render('invoice', {
          title,
        }),
        scripts: ['invoice'],
      })),
  );
};
