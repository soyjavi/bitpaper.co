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

  const nextProps = Object.assign(props, {
    xpub: xpub && !error ? xpub : undefined,
    address: !xpub && !error ? address : undefined,
  });
  Object.keys(nextProps).forEach((key) => { nextProps[key] = encrypt(nextProps[key], entropy); });

  user.get('profile').save(nextProps);

  return error
    ? ERROR.INVALID_BTC_ADDRESS(res)
    : res.status(204).json();
};
