import shortid from 'shortid';
import Storage from 'vanilla-storage';

import { C } from '../common';
import { parseInvoice } from './modules';

const { STATE } = C;

export default async ({ session, props }, res) => {
  const data = await parseInvoice(res, session, { ...props, state: STATE.DRAFT });

  const user = new Storage({ filename: session.username });
  const invoice = user.get('invoices').push({
    ...data,
    id: shortid.generate(),
  });

  return res.json(invoice);
};
