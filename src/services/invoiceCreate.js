import dotenv from 'dotenv';
import generate from 'nanoid/generate';
import Storage from 'vanilla-storage';

import { C } from '../common';
import { parseInvoice } from './modules';

dotenv.config();
const { SECRET: secret } = process.env;
const { STATE, STORE } = C;
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default async ({ session, props }, res) => {
  const data = await parseInvoice(res, session, { ...props, state: STATE.DRAFT });
  const { username } = session;

  const db = new Storage({ ...STORE.DB, secret });
  db.get('invoices');

  let id;
  while (!id) {
    const nextId = generate(ALPHABET, 8);
    id = db.findOne({ id: nextId }) ? undefined : nextId;
  }
  db.push({ username, id });

  const user = new Storage({ filename: username, secret });
  const invoice = user.get('invoices').push({ ...data, id });

  return res.json(invoice);
};
