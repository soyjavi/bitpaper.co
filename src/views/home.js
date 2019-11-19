import Storage from 'vanilla-storage';

import { C } from '../common';
import cache from '../common/cache';
import render from '../common/render';

const { STORE } = C;

export default ({ originalUrl }, res) => {
  const store = new Storage(STORE.CURRENCIES);
  const rates = store.get('rates').value;

  res.send(
    cache.set(originalUrl,
      render('index', {
        page: 'home',
        content: render('home', { rates: JSON.stringify(rates) }),
        scripts: ['home'],
      })),
  );
};
