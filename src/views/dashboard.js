import { C, formatPrice } from '../common';
import render from '../common/render';
import exchange from '../common/exchange';

import { normalizeHtml } from './modules';

const { STATE } = C;

const renderItem = ({
  concept, currency, items, to: { name }, total, ...item
}) => render('templates/invoiceItem', {
  ...item,
  customer: `${name} - <span class="color-lighten">${concept}</span>`,
  total: formatPrice(total, currency),
  totalBTC: formatPrice(exchange(total, currency), 'BTC'),
});

export default ({ session }, res) => {
  if (!session) res.redirect('/logout');
  const { invoices = [] } = session;

  const drafts = invoices.filter((invoice) => invoice.state === STATE.DRAFT);
  const ready = invoices.filter((invoice) => invoice.state !== STATE.DRAFT);

  return res.send(
    render('index', {
      page: 'dashboard',
      content: render('dashboard', {
        drafts: normalizeHtml(drafts.map(renderItem)),
        draftsTotal: 0,
        ready: normalizeHtml(ready.map(renderItem)),
        unpaidTotal: 0,
        paidTotal: 0,
      }),
      scripts: ['dashboard'],
    }),
  );
};
