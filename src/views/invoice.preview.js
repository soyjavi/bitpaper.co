import Storage from 'vanilla-storage';

import {
  C, ERROR, calcTotal, getAddress, priceFormat, rateSatoshis, render,
} from '../common';

const { ICON, TITLE } = C;

const normalizeHtml = (array = []) => array.toString().replace(/,/g, '');

export default async ({ subdomains: [subdomain = 'soyjavi'], props: { id } = {} }, res) => {
  const user = new Storage({ filename: subdomain });
  const profile = user.get('profile').value;
  const invoice = user.get('invoices').findOne({ id });

  if (!invoice) return ERROR.NOT_FOUND(res);

  const address = getAddress(invoice, profile);
  if (!address) return ERROR.MESSAGE(res, { message: 'Something wrong' });

  const {
    currency, reference, concept, issued, due, from = {}, to = {}, items = [], terms,
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

        logo: 'https://via.placeholder.com/128' || ICON,
        reference,
        concept,
        issued: (new Date(issued)).toString(),
        due,

        from: {
          name: from.name || profile.name,
          location: (from.location || profile.location || []).join('<br>'),
          email: from.email || profile.email,
          phone: from.phone || profile.phone,
        },

        to: { ...to, location: to.location.join('<br>') },

        items: normalizeHtml(items
          .map(({ price, quantity, ...item }) => render('templates/item', {
            ...item,
            quantity,
            price: priceFormat(price, currency),
            total: priceFormat(price * quantity, currency),
          }))),

        terms,
        address,
        qr: `/qr/${address}/${totalBTC}?label=${reference}`,
        total: priceFormat(total, currency),
        totalBTC,

        footer: render('templates/footer'),
      }),
    }),
  );
};
