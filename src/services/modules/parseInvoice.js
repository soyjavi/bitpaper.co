import { ERROR } from '../../common';

export default (res, session, props) => {
  const {
    address = session.address, products = [], ...inherit
  } = props;
  let {
    satoshis = 0, date, location = [], recipient = [],
  } = props;

  satoshis = parseInt(satoshis, 10);
  date = date || (new Date()).getTime();
  location = location.length > 0 ? location : session.location;
  recipient = recipient.length > 0 ? recipient : undefined;

  if (satoshis === 0 && products.length === 0) return ERROR.REQUIRED_PARAMETERS(res, 'satoshis or products.');
  if (!address && !session.xpub) return ERROR.REQUIRED_PARAMETERS(res, 'address or xpub');

  return {
    ...inherit,

    satoshis,
    address,

    date,
    location,
    recipient,
    products,
  };
};
