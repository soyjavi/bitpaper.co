export default {
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
    USERS: { filename: 'users', defaults: { active: [], blocked: [] } },
    USER: { defaults: { profile: {}, invoices: [], sessions: [] } },
    CURRENCIES: { filename: 'currencies', defaults: { rates: [] } },
  },

  SYMBOLS: {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    BTC: '₿',
  },
};
