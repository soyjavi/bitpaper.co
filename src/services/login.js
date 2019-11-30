import * as Bip39 from 'bip39';
import dotenv from 'dotenv';
import Storage from 'vanilla-storage';
import { decrypt } from 'vanilla-storage/dist/modules';

import { C, ERROR } from '../common';
import { session } from './modules';

dotenv.config();
const { SECRET: secret } = process.env;
const { COOKIE_MAXAGE, STORE } = C;

// const mnemonicDecompiled = Bip39.entropyToMnemonic(authorization);

export default ({ props: { username, mnemonic } }, res) => {
  if (!Bip39.validateMnemonic(mnemonic)) return ERROR.NOT_FOUND(res);

  const authorization = session(username, mnemonic);
  const { entropy } = decrypt(authorization, secret);

  const store = new Storage({ ...STORE.DB, secret });
  const user = store.get('users').findOne({ username });

  try {
    if (!user || decrypt(user.passport, entropy) !== username) return ERROR.NOT_FOUND(res);
    res.cookie('authorization', authorization, { maxAge: COOKIE_MAXAGE, httpOnly: true });
  } catch (e) { return ERROR.NOT_FOUND(res); }

  return res.json({ authorization });
};
