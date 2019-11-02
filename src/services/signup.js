import Storage from 'vanilla-storage';

import { C, ERROR } from '../common';
import session from './modules/session';

const { STORE } = C;

export default ({ props }, res) => {
  const {
    email, username, password, name,
  } = props;

  const users = new Storage(STORE.USERS);
  users.get('active');

  if (users.findOne({ username })) return ERROR.CONFLICT(res);

  users.push({
    email, username, password, createdAt: (new Date()).getTime(),
  });

  new Storage({
    filename: username,
    defaults: { ...STORE.USER.defaults, profile: { email, name } },
  });

  return res.json({
    authorization: session(username, res),
    username,
  });
};
