import fetch from 'node-fetch';
import Storage from 'vanilla-storage';

import C from './constants';
import mail from './mail';
import render from './render';

const { STATE: { CONFIRMED } } = C;
const BASE_URL = 'https://blockstream.info/api/address';

const sendEmail = (recipient, props) => mail({
  to: recipient.email,
  subject: `Status Invoice #${props.reference}`,
  text: render('templates/mailTransaction', { ...props, name: recipient.name }),
});

export default async (username, invoice = {}) => {
  let { tx = {} } = invoice;

  if (!tx.id || (tx.id && !tx.confirmed)) {
    const response = await fetch(`${BASE_URL}/${invoice.address}/txs`).catch((error) => console.error(error));

    if (!response) throw Error('Something wrong');
    const txs = await response.json();

    txs.some(({ txid: id, vout: outputs = [], status: { confirmed, block_time: timestamp } }) => {
      const output = outputs.find(({ scriptpubkey_address: address, value: satoshis }) => (
        address === invoice.address && satoshis === invoice.satoshis
      ));

      if (output) {
        const { from, to, state } = invoice;
        tx = { id, confirmed, timestamp: timestamp * 1000 };

        const user = new Storage({ filename: username });
        user.get('invoices').update({ id: invoice.id }, { ...invoice, tx, state: confirmed ? CONFIRMED : state });

        const mailProps = {
          ...invoice,
          username,
          tx,
          state: confirmed ? 'confirmed' : 'pending to confirmed',
        };

        if (from.email) sendEmail(from, mailProps);
        if (from.email) sendEmail(to, mailProps);
      }

      return output !== undefined;
    });
  }

  return tx;
};
