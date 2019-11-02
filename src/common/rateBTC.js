import fetch from 'node-fetch';

const DEFAULT_VALUE = 0;

export default async (amount, base = 'USD') => {
  const response = await fetch(`https://tickermaster.glitch.me/convert/${base}/${amount}/BTC`);
  if (!response) return DEFAULT_VALUE;

  const { value = DEFAULT_VALUE } = await response.json();

  return value.toFixed(6);
};
