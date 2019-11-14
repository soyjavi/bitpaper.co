import C from './constants';

const { CURRENCY } = C;

export default (amount, currency = CURRENCY, rates = {}) => {
  const conversion = currency === CURRENCY ? 1 : rates[currency] / 1;

  return amount / conversion / rates.BTC;
};
