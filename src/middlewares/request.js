import onFinished from 'on-finished';
import Storage from 'vanilla-storage';

import { C, ERROR } from '../common';

const { STORE } = C;

export default (req, res, next) => {
  const { headers: { cookie = '' }, originalUrl = '' } = req;
  const today = new Date();
  const timestamp = today.getTime();

  // -- Get cookies
  const cookies = {};
  cookie.split(';').forEach((item) => {
    const parts = item.split('=');
    cookies[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  req.authorization = cookies.authorization;

  // -- Set permissive CORS header
  res.setHeader('Access-Control-Allow-Origin', '*');

  // -- Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');

  // -- Parse all parameters as props of request
  req.props = { ...req.params, ...req.query, ...req.body };

  // -- Determine session
  let { authorization, username } = req.cookies || {};
  if (!authorization && !username) {
    authorization = req.headers.authorization || req.authorization;
    username = req.headers.username;
  }

  if (authorization && username) {
    const users = new Storage(STORE.USERS);
    if (users.get('active').findOne({ username })) {
      const user = new Storage({ filename: username });
      const currentSession = user.get('sessions').value.pop() || {};
      if (authorization === currentSession.authorization) {
        req.session = {
          username,
          ...user.get('profile').value,
          invoices: user.get('invoices').value,
        };
      }
    }
  }

  onFinished(res, () => {
    console.log(`${req.method} ${originalUrl} ${res.statusCode} - - ${new Date().getTime() - timestamp} ms`);
  });

  next();
};
