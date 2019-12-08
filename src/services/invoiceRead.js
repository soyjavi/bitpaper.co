import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import { ERROR } from '../common';

dotenv.config();
const { SECRET: secret } = process.env;

export default ({ session, props: { id } }, res) => {
  const user = new Storage({ filename: session.username, secret });
  const invoice = user.get('invoices').findOne({ id });

  return invoice ? res.json(invoice) : ERROR.NOT_FOUND(res);
};
