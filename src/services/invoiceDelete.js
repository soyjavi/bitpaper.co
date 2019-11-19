import Storage from 'vanilla-storage';

import { ERROR } from '../common';

export default ({ session, props: { id } }, res) => {
  const user = new Storage({ filename: session.username });
  const invoice = user.get('invoices').findOne({ id });

  if (!invoice) return ERROR.NOT_FOUND(res);

  const invoices = user.value.filter((item) => item.id !== id);
  user.get('invoices').save(invoices);

  return res.send();
};
