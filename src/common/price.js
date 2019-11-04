import C from './constants';

const { CURRENCY } = C;

const SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  BTC: '₿',
};

const FIXED = {
  BTC: 6,
  JPY: 0,
};

export default (amount = 0, currency = CURRENCY) => {
  let left = '';
  let right = '';
  const symbol = SYMBOLS[currency] || currency;

  if (currency === CURRENCY) left = symbol;
  else right = symbol;

  return `${left}${amount.toFixed(FIXED[currency] || 2)}${right}`;
};
