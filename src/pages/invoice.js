import Storage from 'vanilla-storage';

import {
  C, ERROR, getAddress, price, rateSatoshis, render,
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
    currency, reference, concept, date, products = [], terms, recipient = [], location = [],
  } = invoice;
  let { satoshis, total = 0 } = invoice;

  // Determine price
  if (products.length > 0) {
    const reducer = products.reduce((a, b) => ({ total: (a.total) + (b.quantity * b.price) }), { total: 0 });
    total = reducer.total;
    satoshis = await rateSatoshis(reducer.total, currency);
  } else {
    // @TODO: Determine rate right now
    total = 0;
  }

  const totalBTC = satoshis / 100000000;

  return res.send(
    render('index', {
      page: 'invoice',
      // title: 'Invoicer',
      title: `${TITLE} - Invoice`,
      scripts: ['payment'],
      content: render('invoice', {
        // ---
        ...profile,
        logo: 'https://via.placeholder.com/128' || ICON,
        // ---
        reference,
        date,
        concept,

        location: normalizeHtml(location.map((line) => `<p>${line}</p>`)),
        recipient: normalizeHtml(recipient.map((line) => `<p>${line}</p>`)),

        terms,
        address,
        total: price(total),
        totalBTC,
        qr: `/qr/${address}/${totalBTC}?label=${reference}`,
        products: normalizeHtml(products
          .map(({ price, ...product }) => render('templates/product', {
            ...product, price: `$${price}`, total: `$${(price * product.quantity).toFixed(2)}`,
          }))),
      }),
    }),
  );
};
