import Storage from 'vanilla-storage';

import C from './constants';

const { CURRENCY, STORE } = C;

export default (amount, currency = CURRENCY) => {
  const store = new Storage(STORE.CURRENCIES);
  const rates = store.get('rates').value;
  const conversion = currency === CURRENCY ? 1 : rates[currency] / 1;

  return amount / conversion / rates.BTC;
};
