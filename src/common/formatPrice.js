import C from './constants';

const { CURRENCY, SYMBOLS } = C;

const FIXED = {
  BTC: 6,
  JPY: 0,
};

export default (amount = 0, currency = CURRENCY) => {
  let left = '';
  let right = '';
  const symbol = SYMBOLS[currency] || currency;
  const sign = amount < 0 ? '-' : '';

  if (currency === CURRENCY) left = symbol;
  else right = symbol;

  return `${sign}${left}${Math.abs(amount.toFixed(FIXED[currency] || 2))}${right}`;
};
