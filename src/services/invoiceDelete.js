import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import { ERROR } from '../common';

dotenv.config();
const { SECRET: secret } = process.env;

export default ({ session, props: { id } }, res) => {
  const user = new Storage({ filename: session.username, secret });
  const invoice = user.get('invoices').findOne({ id });

  if (!invoice) return ERROR.NOT_FOUND(res);
  user.get('invoices').remove({ id });

  return res.send();
};
