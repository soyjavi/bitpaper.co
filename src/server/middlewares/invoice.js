import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import { C, ERROR } from '../../common';

dotenv.config();
const { SECRET: secret } = process.env;
const { STORE } = C;

export default (req, res, next) => {
  const { props: { id } } = req;

  const db = new Storage({ ...STORE.DB, secret });
  const { username } = db.get('invoices').findOne({ id }) || {};
  if (!username) return ERROR.NOT_FOUND(res);

  const user = new Storage({ filename: username, secret });
  const invoice = user.get('invoices').findOne({ id });
  if (!invoice) return ERROR.NOT_FOUND(res);

  req.invoice = { ...invoice, username };

  return next();
};
