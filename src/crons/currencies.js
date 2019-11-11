import fetch from 'node-fetch';
import Storage from 'vanilla-storage';

import { C } from '../common';

const { CURRENCY, STORE } = C;

export default async () => {
  const response = await fetch(`https://tickermaster.glitch.me/${CURRENCY}/latest`);
  if (response) {
    const { rates = {} } = await response.json();

    if (Object.keys(rates).length > 0) {
      const store = new Storage(STORE.CURRENCIES);
      store.get('rates').save(rates);
    }
  }
};
