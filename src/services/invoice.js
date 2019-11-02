import shortid from 'shortid';
import Storage from 'vanilla-storage';

import { C } from '../common';
import { parseInvoice } from './modules';

const { STATE } = C;

export default ({ session, props }, res) => {
  const data = parseInvoice(res, session, props);

  const user = new Storage({ filename: session.username });
  const invoice = user.get('invoices').push({
    ...data,
    id: shortid.generate(),
    state: STATE.DRAFT,
  });

  return res.json(invoice);
};
