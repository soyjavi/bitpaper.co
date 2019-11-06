import { cache, render } from '../common';

export default ({ originalUrl, session, props: { id } }, res) => {
  if (!session) res.redirect('/');

  const isNew = id === 'new';
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
