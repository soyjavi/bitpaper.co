import { C, ERROR, getTotal } from '../../common';
import { rateSatoshis } from '../../server/modules';
import createAddress from './createAddress';
import validateAddress from './validateAddress';

const { CURRENCY, DATE_FORMATS, STATE: { DRAFT, PUBLISHED } } = C;
const [DATE_FORMAT] = DATE_FORMATS;

export default async (res, session, props) => {
  const { xpub } = session;
  let address;

  try {
    address = props.address || session.address || createAddress(xpub, session.invoices);
    validateAddress(address);
  } catch (e) { return ERROR.INVALID_BTC_ADDRESS(res); }

  const {
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
  if (!address && !xpub) return ERROR.REQUIRED_PARAMETERS(res, 'address or xpub');
  if (due && issued > due) return ERROR.MESSAGE(res, { message: 'Incorrect range of dates.' });

  const total = getTotal(items);
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
