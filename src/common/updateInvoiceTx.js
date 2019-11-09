import fetch from 'node-fetch';
import Storage from 'vanilla-storage';

import C from './constants';

const { STATE: { CONFIRMED } } = C;
const BASE_URL = 'https://blockstream.info/api/address';

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
        tx = { id, confirmed, timestamp: timestamp * 1000 };

        const user = new Storage({ filename: username });
        user.get('invoices').update({ id: invoice.id }, {
          ...invoice,
          tx,
          state: confirmed ? CONFIRMED : invoice.state,
        });

        // @TODO: Should comunicate to recipients the new state of the tx
      }

      return output !== undefined;
    });
  }

  return tx;
};
