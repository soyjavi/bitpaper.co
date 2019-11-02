import { SHA256 } from 'crypto-js';
import Storage from 'vanilla-storage';

const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

export default (username, res) => {
  const user = new Storage({ filename: username });
  const timestamp = (new Date()).getTime();
  const authorization = SHA256(JSON.stringify({ username, timestamp })).toString();

  res.cookie('authorization', authorization, { maxAge: TWO_WEEKS, httpOnly: true });
  res.cookie('username', username, { maxAge: TWO_WEEKS, httpOnly: true });

  user.get('sessions').push({ authorization, timestamp });

  return authorization;
};
