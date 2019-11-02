import dotenv from 'dotenv';
import fetch from 'node-fetch';

import { cache, rateBTC, render } from '../common';

const bitcoin = require('bitcoinjs-lib');

dotenv.config();
const { XPUBKEY: xpubKey } = process.env;


export default async ({ originalUrl, params: { invoice } = {} }, res) => {
  const node = bitcoin.bip32.fromBase58(xpubKey, bitcoin.networks.bitcoin);
  const receiveBase = node.derive(0);

  const addresses = [];
  for (let i = 0; i < 1; i += 1) {
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: receiveBase.derive(i).publicKey,
      network: bitcoin.networks.bitcoin,
    });
    addresses.push(address);
  }
  const [address] = addresses;

  const products = [
    { quantity: 2, description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', price: 12.95 },
    { quantity: 1, description: 'Lorem Ipsum has been the industry', price: 22.15 },
    { quantity: 3, description: ' standard dummy text ever since the 1500s', price: 2.95 },
  ];

  const { total } = products.reduce((a, b) => ({ total: (a.total) + (b.quantity * b.price) }), { total: 0 });
  const amount = await rateBTC(total);

  console.log({ total, amount });

  res.send(
    render('index', {
      page: 'invoice',
      title: 'Invoicer',
      scripts: ['payment'],
      content: render('invoice', {
        address,
        amount,
        invoice,
        products: products
          .map(({ price, ...product }) => render('templates/product', {
            ...product, price: `$${price}`, total: `$${(price * product.quantity).toFixed(2)}`,
          }))
          .toString().replace(/,/g, ''),

        qr: `/qr/${addresses}/${amount}?label=${invoice}`,
        total: `$${total.toFixed(2)}`,

      }),
    }),
  );
};
