import Storage from 'vanilla-storage';

import { C, ERROR } from '../common';
import { session } from './modules';

const { STORE } = C;

export default ({ props }, res) => {
  const {
    email, username, password, name,
  } = props;

  let store = new Storage(STORE.USERS);
  store.get('active');

  if (store.findOne({ username })) return ERROR.CONFLICT(res);

  store.push({
    email, username, password, createdAt: (new Date()).getTime(),
  });

  store = new Storage({
    filename: username,
    defaults: { ...STORE.USER.defaults, profile: { email, name } },
  });

  return res.json({
    authorization: session(username, res),
    username,
  });
};
