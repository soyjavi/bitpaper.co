export default {
  COOKIE_MAXAGE: 14 * 24 * 60 * 60 * 1000, // 14-days

  CURRENCY: 'USD',
  CURRENCIES: [
    'USD (United States Dollar)',
    'EUR (Euro Member Countries)',
    'GBP (United Kingdom Pound)',
    'JPY (Japan Yen)',
    'BTC (Bitcoin)',
  ],

  DATE_FORMATS: ['YYYY/MM/DD', 'DD/MM/YYYY', 'MM/DD/YYYY'],

  STATE: {
    DRAFT: 0,
    PUBLISHED: 1,
    CONFIRMED: 2,
    CANCELLED: 99,
  },

  STORE: {
    DB: { filename: 'db', defaults: { users: [], rates: {}, invoices: [] } },
    USER: { defaults: { profile: {}, invoices: [] } },
    CURRENCIES: { filename: 'currencies', defaults: { rates: {} } },
  },

  SYMBOLS: {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    BTC: '₿',
  },
};
