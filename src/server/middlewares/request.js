import dotenv from 'dotenv';
import onFinished from 'on-finished';
import Storage from 'vanilla-storage';
import { decrypt } from 'vanilla-storage/dist/modules';

import { C } from '../../common';

dotenv.config();
const { SECRET: secret } = process.env;
const { STORE } = C;
const DEFAULT_DOMAIN = 'soyjavi';

export default (req, res, next) => {
  const { headers, originalUrl = '', subdomains: [domain = DEFAULT_DOMAIN] } = req;
  const today = new Date();
  const timestamp = today.getTime();

  // -- Set permissive CORS header
  res.setHeader('Access-Control-Allow-Origin', '*');

  // -- Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');

  // -- Parse all parameters as props of request
  req.props = {
    ...req.params, ...req.query, ...req.body, domain,
  };

  // -- Determine session
  let { authorization } = req.cookies || {};
  if (!authorization) authorization = headers.authorization;

  if (authorization) {
    try {
      const { entropy, username } = decrypt(authorization, secret);

      const users = new Storage({ ...STORE.DB, secret });
      let user = users.get('users').findOne({ username });
      if (user && decrypt(user.passport, entropy) === username) {
        user = new Storage({ filename: username, secret });

        req.session = {
          entropy,
          username,
          ...user.get('profile').value,
          invoices: user.get('invoices').value,
        };
      }
    } catch (e) { console.log(e); }
  }

  onFinished(res, () => {
    console.log(`${req.method} ${originalUrl} ${res.statusCode} - - ${new Date().getTime() - timestamp} ms`);
  });

  next();
};
