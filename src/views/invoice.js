import { cache, render } from '../common';

export default ({ originalUrl, session }, res) => {
  if (!session) res.redirect('/');

  return res.send(
    cache.set(originalUrl,
      render('index', {
        page: 'invoice',
        content: render('invoice'),
        scripts: ['invoice'],
      })),
  );
};
