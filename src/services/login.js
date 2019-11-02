import Storage from 'vanilla-storage';

import { C, ERROR } from '../common';
import session from './modules/session';

const { STORE } = C;

export default ({ props: { username, password } }, res) => {
  const users = new Storage(STORE.USERS);
  users.get('active');

  const user = users.findOne({ username, password });

  if (!user) return ERROR.NOT_FOUND(res);

  return res.json({
    authorization: session(username, res),
    username,
  });
};
