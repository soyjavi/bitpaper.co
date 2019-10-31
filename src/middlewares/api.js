import Storage from 'vanilla-storage';

import { C, ERROR } from '../common';
import MAP from '../../map.json';

const { STORE } = C;

export default (req, res, next) => {
  const url = req.originalUrl.split('/')[2].split('?')[0];
  const route = MAP[url];
  let error;

  if (!route) error = `Unknown route: ${url}`;
  else {
    const { required = [], optional = [], secure = false } = route;

    // 1. Test if has a valid session
    if (secure) {
      const { authorization = req.authorization, username, secret } = req.headers;
      if (!authorization) return ERROR.FORBIDDEN(res);

      const users = new Storage(STORE.USERS);
      if (!users.get('active').findOne({ username })) return ERROR.NOT_FOUND(res);

      const user = new Storage({ filename: 'soyjavi', secret });
      const currentSession = user.get('sessions').value.pop() || {};
      if (authorization !== currentSession.authorization) return ERROR.FORBIDDEN(res);

      req.session = { username, ...user.get('profile').value, invoices: user.get('invoices').value };
    }

    // 2. Plain props
    const routeProps = required.concat(optional);
    const props = {};
    Object.keys(req.props).forEach((key) => {
      if (routeProps.includes(key)) props[key] = req.props[key];
    });

    // 3. Required parameters
    if (required.length > 0) {
      const propsKeys = Object.keys(props);
      const requiredParameters = required.filter((x) => !propsKeys.includes(x));

      if (requiredParameters.length > 0) error = `Required parameters: ${requiredParameters.join(', ')}`;
    }

    req.props = props;
  }

  if (error) return ERROR.MESSAGE(res, { message: error });

  return next();
};
