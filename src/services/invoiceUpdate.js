import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import { C, ERROR } from '../common';
import { parseInvoice } from './modules';

dotenv.config();
const { SECRET: secret } = process.env;
const { STATE: { CONFIRMED } } = C;

export default async ({ session, props: { id, ...inherit } }, res) => {
  const user = new Storage({ filename: session.username, secret });
  let invoice = user.get('invoices').findOne({ id });

  if (!invoice) return ERROR.NOT_FOUND(res);
  if (invoice.state === CONFIRMED) {
    return ERROR.MESSAGE(res, { message: `Invoice ${invoice.reference} already paid and confirmed.` });
  }

  const data = await parseInvoice(res, session, inherit);
  invoice = user.get('invoices').update({ id }, { ...data, id });

  return res.json(invoice);
};
