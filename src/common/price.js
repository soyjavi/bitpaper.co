import C from './constants';

const { CURRENCY } = C;

export default (amount, currency = CURRENCY) => {
  let left = '';
  let right = '';

  if (currency === CURRENCY) left = '$';
  else right = currency;

  return `${left}${amount.toFixed(2)}${right}`;
};
