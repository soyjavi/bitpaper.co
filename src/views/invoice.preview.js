import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

import {
  ERROR, calcTotal, priceFormat, rateSatoshis,
} from '../common';
import render from '../common/render';
import { normalizeHtml } from './modules';

dotenv.config();
const { ICON, TITLE } = process.env;

export default async ({ props: { domain, id } = {} }, res) => {
  const user = new Storage({ filename: domain });
  const profile = user.get('profile').value;
  const invoice = user.get('invoices').findOne({ id });

  if (!invoice) return ERROR.NOT_FOUND(res);

  const {
    address, currency, due, from = {}, issued, items = [], reference, to = {},
  } = invoice;
  let { satoshis, total = 0 } = invoice;

  // Determine price
  if (items.length > 0) {
    total = calcTotal(items);
    satoshis = await rateSatoshis(total, currency);
  } else {
    // @TODO: Determine rate right now
    total = 0;
  }

  const totalBTC = satoshis / 100000000;

  return res.send(
    render('index', {
      page: 'invoice-preview',
      title: `${TITLE} - Invoice`,
      scripts: ['payment'],
      content: render('invoice.preview', {
        ...profile,
        ...invoice,

        id,
        domain,

        logo: 'https://via.placeholder.com/128' || ICON,
        issued: (new Date(issued)).toString(),
        due,

        from: {
          name: from.name || profile.name,
          location: (from.location || profile.location || []).join('<br>'),
          email: from.email || profile.email,
          phone: from.phone || profile.phone,
        },

        to: { ...to, location: (to.location || []).join('<br>') },

        items: normalizeHtml(items
          .map(({ price, quantity, ...item }) => render('templates/item', {
            ...item,
            quantity,
            price: priceFormat(price, currency),
            total: priceFormat(price * quantity, currency),
          }))),

        address,
        qr: `/qr/${address}/${totalBTC}?label=${reference}`,
        total: priceFormat(total, currency),
        totalBTC,
      }),
    }),
  );
};
