import { SHA256 } from 'crypto-js';
import Storage from 'vanilla-storage';

export default (username) => {
  let value;

  const user = new Storage({ filename: username });
  const timestamp = (new Date()).getTime();
  const authorization = SHA256(JSON.stringify({ username, timestamp })).toString();

  user.get('sessions').push({ authorization, timestamp });

  return authorization;
};
