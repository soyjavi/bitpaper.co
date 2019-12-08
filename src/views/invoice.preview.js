import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import { C, ERROR, formatPrice } from '../common';
import { formatDate, rateSatoshis, render } from '../server/modules';
import { normalizeHtml } from './modules';

dotenv.config();
const { ICON, SECRET: secret, TITLE } = process.env;
const { STATE, STORE } = C;

export default async ({ session = {}, props: { id } = {} }, res) => {
  const db = new Storage({ ...STORE.DB, secret });
  const { username } = db.get('invoices').findOne({ id }) || {};
  if (!username) return ERROR.NOT_FOUND(res);

  const user = new Storage({ filename: username, secret });
  const invoice = user.get('invoices').findOne({ id });
  if (!invoice) return ERROR.NOT_FOUND(res);

  const {
    address, currency, due, from = {}, issued, items = [], total, to = {}, state,
  } = invoice;
  let { satoshis } = invoice;
  const isOwner = username === session.username;
  const isConfirmed = state === STATE.CONFIRMED;
  let options = '<button class="fixed" disabled>Print</button>';
  if (isOwner) {
    options = isConfirmed
      ? '<a href="/" class="button fixed">Dashboard</a>'
      : `<a href="/invoice/${id}" class="button fixed">Edit Invoice</a>`;
  }

  // Each time customer watch the invoice we should calculate the satoshis
  if (!isOwner && items.length > 0) {
    satoshis = await rateSatoshis(total, currency);
    user.update({ id }, { ...invoice, satoshis });
  }

  const totalBTC = satoshis / 100000000;

  return res.send(
    render('index', {
      page: 'invoice-preview',
      title: `${TITLE} - Invoice`,
      scripts: !isConfirmed ? ['payment'] : [],
      content: render('invoice.preview', {
        ...invoice,

        id,

        options,

        logo: 'https://via.placeholder.com/128' || ICON,
        issued: formatDate(issued),
        due,

        from: { ...from, location: (from.location || []).join('<br>') },
        to: { ...to, location: (to.location || []).join('<br>') },

        items: normalizeHtml(items
          .map(({ price, quantity, ...item }) => render('templates/item', {
            ...item,
            quantity,
            price: formatPrice(price, currency),
            total: formatPrice(price * quantity, currency),
          }))),

        total: formatPrice(total, currency),

        info: isConfirmed
          ? render('templates/invoiceTransaction', {
            ...invoice, total: formatPrice(total, currency), totalBTC,
          })
          : render('templates/invoicePayment', {
            id, address, total: formatPrice(total, currency), totalBTC,
          }),
      }),
    }),
  );
};
