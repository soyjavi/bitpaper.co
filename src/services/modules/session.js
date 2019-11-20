import * as Bip39 from 'bip39';
import { SHA256 } from 'crypto-js';
import dotenv from 'dotenv';
import { encrypt } from 'vanilla-storage/dist/modules';

dotenv.config();
const { SECRET: secret } = process.env;

export default (username, mnemonic) => encrypt({
  entropy: SHA256(Bip39.mnemonicToEntropy(mnemonic)).toString(),
  username,
}, secret);
