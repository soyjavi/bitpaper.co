import Storage from 'vanilla-storage';

import { C, ERROR } from '../common';
import { parseInvoice } from './modules';

const { STATE: { PAID } } = C;

export default ({ session, props: { id, ...inherit } }, res) => {
  const user = new Storage({ filename: session.username });
  let invoice = user.get('invoices').findOne({ id });

  if (!invoice) return ERROR.NOT_FOUND(res);
  if (invoice.state === PAID) return ERROR.MESSAGE(res, { message: `Invoice ${invoice.reference} already paid.` });

  const nextData = parseInvoice(res, session, inherit);

  invoice = user.get('invoices').update({ id }, nextData);

  return res.json(invoice);
};
