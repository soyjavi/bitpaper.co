import Storage from 'vanilla-storage';

import { ERROR, updateInvoiceTx } from '../common';

export default async ({ props: { domain, id } }, res) => {
  const user = new Storage({ filename: domain });
  const invoice = user.get('invoices').findOne({ id });

  if (!invoice) return ERROR.NOT_FOUND(res);

  return res.json(await updateInvoiceTx(domain, invoice));
};
