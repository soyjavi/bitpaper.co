import dotenv from 'dotenv';
import Storage from 'vanilla-storage';
import tor from 'tor-request';

import { C } from '../../common';
import mail from './mail';
import render from './render';

dotenv.config();
const { SECRET: secret } = process.env;
const { STATE: { CONFIRMED } } = C;
const BASE_URL = 'https://blockstream.info/api/address';

const sendEmail = (recipient, props) => mail({
  to: recipient.email,
  subject: `Status Invoice #${props.reference}`,
  text: render('templates/mailTransaction', { ...props, name: recipient.name }),
});

const torAsync = (url) => new Promise((resolve, reject) => {
  tor.request(url, (error, res, body) => (error ? reject(error) : resolve(body)));
});

export default async (username, invoice = {}) => {
  let { tx = {} } = invoice;

  if (!tx.id || (tx.id && !tx.confirmed)) {
    const response = await torAsync(`${BASE_URL}/${invoice.address}/txs`).catch((error) => { throw Error(error); });

    if (!response) throw Error('Something wrong');
    const txs = JSON.parse(response);

    txs.some(({ txid: id, vout: outputs = [], status: { confirmed, block_time: timestamp } }) => {
      const output = outputs.find(({ scriptpubkey_address: address, value: satoshis }) => (
        address === invoice.address && satoshis === invoice.satoshis
      ));

      if (output) {
        const { from, to, state } = invoice;
        tx = { id, confirmed, timestamp: timestamp * 1000 };

        const user = new Storage({ filename: username, secret });
        user.get('invoices').update({ id: invoice.id }, { ...invoice, tx, state: confirmed ? CONFIRMED : state });

        const mailProps = {
          ...invoice,
          username,
          tx,
          state: confirmed ? 'confirmed' : 'pending to confirmed',
        };

        if (from.email) sendEmail(from, mailProps);
        if (to.email) sendEmail(to, mailProps);
      }

      return output !== undefined;
    });
  }

  return tx;
};
