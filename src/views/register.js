import cache from '../common/cache';
import render from '../common/render';

export default ({ originalUrl }, res) => res.send(
  cache.set(originalUrl,
    render('index', {
      page: 'register',
      content: render('register'),
      scripts: ['register'],
    })),
);
