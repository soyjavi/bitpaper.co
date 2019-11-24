import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import { C } from '../common';

dotenv.config();
const { SECRET: secret } = process.env;
const { STORE } = C;

export default ({ props: { username } }, res) => {
  const store = new Storage({ ...STORE.DB, secret });

  res.json({
    username,
    exists: store.get('users').findOne({ username: username.trim().toLowerCase() }) !== undefined,
  });
};
