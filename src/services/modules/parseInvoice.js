import { C, ERROR } from '../../common';

import createAddress from './createAddress';

const { CURRENCY, DATE_FORMATS } = C;
const [DATE_FORMAT] = DATE_FORMATS;

export default (res, session, props) => {
  const {
    address = session.address || createAddress(session.xpub, session.invoices),
    currency = CURRENCY,
    issued = (new Date()).getTime(),
    due,
    dateFormat = DATE_FORMAT,
    items = [],
    from = {},
    to = {},
    ...inherit
  } = props;

  let { satoshis = 0 } = props;

  satoshis = parseInt(satoshis, 10);

  if (satoshis === 0 && items.length === 0) return ERROR.REQUIRED_PARAMETERS(res, 'satoshis or items.');
  if (!address && !session.xpub) return ERROR.REQUIRED_PARAMETERS(res, 'address or xpub');
  if (due && issued > due) return ERROR.MESSAGE(res, { message: 'Incorrect range of dates.' });

  return {
    ...inherit,

    satoshis,
    address,
    currency,

    issued,
    due,
    dateFormat,

    from,
    to,

    items: items.map(({ name, quantity, price }) => ({
      name,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price, 10),
    })),
  };
};
