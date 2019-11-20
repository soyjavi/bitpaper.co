import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import { ERROR } from '../common';
import updateInvoiceTx from '../common/updateInvoiceTx';

dotenv.config();
const { SECRET: secret } = process.env;

export default async ({ props: { domain, id } }, res) => {
  const user = new Storage({ filename: domain, secret });
  const invoice = user.get('invoices').findOne({ id });

  if (!invoice) return ERROR.NOT_FOUND(res);

  return res.json(await updateInvoiceTx(domain, invoice));
};
