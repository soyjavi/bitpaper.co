import dotenv from 'dotenv';
import Storage from 'vanilla-storage';
import { encrypt } from 'vanilla-storage/dist/modules';

import { ERROR } from '../common';
import { createAddress, validateAddress } from './modules';

dotenv.config();
const { SECRET: secret } = process.env;

export default ({
  session: { entropy, username },
  props: {
    domain, address, xpub, ...props
  },
}, res) => {
  const user = new Storage({ filename: username, secret });
  let error;

  if (xpub) try { createAddress(xpub); } catch (e) { error = e; }
  else if (address) try { validateAddress(address); } catch (e) { error = e; }

  user.get('profile').save({
    ...props,
    xpub: xpub && !error ? encrypt(xpub, entropy) : undefined,
    address: !xpub && !error ? address : undefined,
  });

  return error
    ? ERROR.INVALID_BTC_ADDRESS(res)
    : res.json({ ...user.value, xpub });
};
