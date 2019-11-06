import { C, ERROR } from '../../common';

const { CURRENCY, DATE_FORMATS } = C;
const [DATE_FORMAT] = DATE_FORMATS;

export default (res, session, props) => {
  const {
    address = session.address,
    currency = CURRENCY,
    issued = (new Date()).getTime(),
    due,
    dateFormat = DATE_FORMAT,
    products = [],
    to,
    ...inherit
  } = props;

  let {
    satoshis = 0, from = {},
  } = props;

  satoshis = parseInt(satoshis, 10);

  if (satoshis === 0 && products.length === 0) return ERROR.REQUIRED_PARAMETERS(res, 'satoshis or products.');
  if (!address && !session.xpub) return ERROR.REQUIRED_PARAMETERS(res, 'address or xpub');
  if (due && issued > due) return ERROR.MESSAGE(res, { message: 'Incorrect dates.' });

  from = {
    name: from.name || session.name,
    location: from.location || session.location,
    email: from.email || session.email,
    phone: from.phone || session.phone,
  };

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
    products,
  };
};
