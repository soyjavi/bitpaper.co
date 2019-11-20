import dotenv from 'dotenv';
import generate from 'nanoid/generate';
import Storage from 'vanilla-storage';

import { C } from '../common';
import { parseInvoice } from './modules';

dotenv.config();
const { SECRET: secret } = process.env;
const { STATE } = C;
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default async ({ session, props }, res) => {
  const data = await parseInvoice(res, session, { ...props, state: STATE.DRAFT });

  const user = new Storage({ filename: session.username, secret });
  const invoice = user.get('invoices').push({
    ...data,
    id: generate(ALPHABET, 8),
  });

  return res.json(invoice);
};
