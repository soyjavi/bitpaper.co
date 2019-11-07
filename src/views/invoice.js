import Storage from 'vanilla-storage';

import cache from '../common/cache';
import render from '../common/render';

export default ({ originalUrl, session, props: { id } }, res) => {
  if (!session) res.redirect('/');

  const isNew = id === 'new';

  if (!isNew) {
    const user = new Storage({ filename: session.username });
    const invoice = user.get('invoices').findOne({ id });
    if (!invoice) return res.redirect('/');
  }

  const title = isNew ? 'New Invoice' : `Invoice: ${id}`;

  return res.send(
    cache.set(originalUrl,
      render('index', {
        page: 'invoice',
        id,
        content: render('invoice', {
          title,
          footer: render('templates/footer'),
        }),
        scripts: ['invoice'],
      })),
  );
};
