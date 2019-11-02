import { cache, render } from '../common';

export default ({ originalUrl, session }, res) => {
  if (session) res.redirect('/dashboard');

  return res.send(
    cache.set(originalUrl,
      render('index', {
        page: 'home',
        content: render('home'),
        scripts: ['home'],
      })),
  );
};
