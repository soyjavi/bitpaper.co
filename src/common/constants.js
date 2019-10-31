import dotenv from 'dotenv';

dotenv.config();
const {
  PRODUCTION,
  CACHE = 0,

  COPYRIGHT, DOMAIN, TITLE, DESCRIPTION, ICON, IMAGE,
  EMAIL, TWITTER, NAME, AVATAR,

  SECRET,
} = process.env;

export default {
  CACHE,

  ENV: {
    IS_PRODUCTION: PRODUCTION !== undefined,
  },

  // -- SITE
  COPYRIGHT,
  DOMAIN,
  TITLE,
  DESCRIPTION,
  ICON,
  IMAGE,

  // -- SOCIAL
  EMAIL,
  TWITTER,
  NAME,
  AVATAR,

  // -- API
  API: {
    HEADERS: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
  },

  STORE: {
    USERS: { filename: 'users', defaults: { active: [], blocked: [] }, secret: SECRET },
    USER: { defaults: { profile: {}, invoices: [], sessions: [] } },
  },
};
