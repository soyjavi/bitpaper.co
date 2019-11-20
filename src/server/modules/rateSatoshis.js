import fetch from 'node-fetch';

import { C } from '../../common';

const { CURRENCY } = C;

export default async (amount, currency = CURRENCY) => {
  const response = await fetch(`https://tickermaster.glitch.me/convert/${currency}/${amount}/BTC`);
  if (!response) return 0;

  const { value = 0 } = await response.json();

  return parseInt(value * 100000000, 10);
};
