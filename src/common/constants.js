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

  CURRENCY: 'USD',

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

  STATE: {
    DRAFT: 0,
    PUBLISHED: 1,
    PAID: 2,
    CANCELLED: 99,
  },

  STORE: {
    USERS: { filename: 'users', defaults: { active: [], blocked: [] }, secret: SECRET },
    USER: { defaults: { profile: {}, invoices: [], sessions: [] } },
  },
};
