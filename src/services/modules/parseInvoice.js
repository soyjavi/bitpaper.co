import {
  C, ERROR, calcTotal, rateSatoshis,
} from '../../common';

import createAddress from './createAddress';

const { CURRENCY, DATE_FORMATS, STATE: { DRAFT, PUBLISHED } } = C;
const [DATE_FORMAT] = DATE_FORMATS;

export default async (res, session, props) => {
  const {
    address = session.address || createAddress(session.xpub, session.invoices),
    currency = CURRENCY,
    issued = (new Date()).getTime(),
    due,
    dateFormat = DATE_FORMAT,
    items = [],
    from = {},
    to = {},
    state = DRAFT,
    ...inherit
  } = props;

  let { satoshis = 0 } = props;

  satoshis = parseInt(satoshis, 10);

  if (satoshis === 0 && items.length === 0) return ERROR.REQUIRED_PARAMETERS(res, 'satoshis or items.');
  if (!address && !session.xpub) return ERROR.REQUIRED_PARAMETERS(res, 'address or xpub');
  if (due && issued > due) return ERROR.MESSAGE(res, { message: 'Incorrect range of dates.' });

  const total = calcTotal(items);
  if (items.length > 0 && (state === DRAFT || state === PUBLISHED)) {
    satoshis = await rateSatoshis(total, currency);
  }

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

    state,

    items: items.map(({ name, quantity, price }) => ({
      name,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price, 10),
    })),
    total,
  };
};
