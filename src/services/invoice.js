import Storage from 'vanilla-storage';

import { ERROR } from '../common';

export default ({ session, props: { id } }, res) => {
  const user = new Storage({ filename: session.username });
  const invoice = user.get('invoices').findOne({ id });

  return invoice ? res.json(invoice) : ERROR.NOT_FOUND(res);
};
