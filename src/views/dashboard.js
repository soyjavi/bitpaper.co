import { C, calcTotal, priceFormat } from '../common';
import render from '../common/render';

import { normalizeHtml } from './modules';

const { STATE } = C;

const renderItem = ({
  concept, currency, items, to: { name }, ...item
}) => render('templates/invoiceItem', {
  ...item,
  customer: `${name} - <span class="color-lighten">${concept}</span>`,
  total: priceFormat(calcTotal(items), currency),
  totalBTC: '?.???????₿',
  // quantity,
  // total: priceFormat(price, currency),
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
        ready: normalizeHtml(ready.map(renderItem)),
      }),
      scripts: ['dashboard'],
    }),
  );
};
