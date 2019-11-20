import * as Bip39 from 'bip39';
import dotenv from 'dotenv';
import Storage from 'vanilla-storage';
import { decrypt, encrypt } from 'vanilla-storage/dist/modules';

import { C, ERROR } from '../common';
import { session } from './modules';

dotenv.config();
const { SECRET: secret } = process.env;
const { COOKIE_MAXAGE, STORE } = C;

export default ({ props }, res) => {
  const { email, name } = props;
  let { username } = props;
  username = username.trim().toLowerCase();

  let store = new Storage({ ...STORE.DB, secret });
  if (store.get('users').findOne({ username })) return ERROR.CONFLICT(res);

  const mnemonic = Bip39.generateMnemonic();
  const authorization = session(username, mnemonic);
  const { entropy } = decrypt(authorization, secret);

  store.push({
    username,
    passport: encrypt(username, entropy),
    timestamp: (new Date()).getTime(),
  });

  store = new Storage({
    filename: username,
    defaults: { profile: {}, invoices: [] },
    secret,
  });
  store.get('profile').save({ email, name });

  res.cookie('authorization', authorization, { maxAge: COOKIE_MAXAGE, httpOnly: true });
  return res.json({
    authorization,
    mnemonic,
    username,
  });
};
