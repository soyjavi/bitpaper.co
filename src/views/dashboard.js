import Storage from 'vanilla-storage';

import { C, formatDate, formatPrice } from '../common';
import render from '../common/render';
import exchange from '../common/exchange';

import { normalizeHtml } from './modules';

const { STATE: { DRAFT, PUBLISHED, CONFIRMED }, STORE } = C;

const renderGroup = (dataSource = [], state, title) => {
  const store = new Storage(STORE.CURRENCIES);
  const rates = store.get('rates').value;

  const invoices = dataSource.filter((invoice) => invoice.state === state);
  const { total: totalBTC } = dataSource
    .reduce((a, b) => ({ total: a.total + exchange(b.total, b.currency, rates) }), { total: 0 });

  return invoices.length > 0
    ? render('templates/invoicesGroup', {
      title,
      action: state === DRAFT ? '<a href="/invoice/new" class="button">New Invoice</a>' : '',
      items: normalizeHtml(invoices.map(({
        concept, currency, items, issued, to: { name = 'Unknown customer' }, total, ...item
      }) => render('templates/invoiceItem', {
        ...item,
        issued: formatDate(issued),
        customer: concept
          ? `${name} - <span class="color-lighten">${concept}</span>`
          : name,
        total: formatPrice(total, currency),
        totalBTC: formatPrice(exchange(total, currency, rates), 'BTC'),
      }))),
      total: formatPrice(totalBTC, 'BTC'),
    })
    : '';
};

export default ({ session }, res) => {
  if (!session) res.redirect('/logout');
  const { invoices = [] } = session;

  return res.send(
    render('index', {
      page: 'dashboard',
      content: render('dashboard', {
        drafts: renderGroup(invoices, DRAFT, 'Drafts'),
        unpaid: renderGroup(invoices, PUBLISHED, 'Unpaid'),
        confirmed: renderGroup(invoices, CONFIRMED, 'Confirmed'),
      }),
    }),
  );
};
