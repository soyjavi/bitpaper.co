import { cache, render } from '../server/modules';

export default ({ originalUrl }, res) => res.send(
  cache.set(originalUrl,
    render('index', {
      page: 'register',
      content: render('register'),
      scripts: ['register'],
    })),
);
