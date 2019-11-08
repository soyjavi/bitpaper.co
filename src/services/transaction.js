import fetch from 'node-fetch';
import Storage from 'vanilla-storage';

import { ERROR } from '../common';

const BASE_URL = 'https://blockstream.info/api/address';

/*
@TODO
1. Find the invoicement using the id && address and username (domain)
2. ask blockstream
3. compare if invoice is in memorypool or already confirmed (using the amount)
*/

export default async ({ props: { domain, invoice: id } }, res) => {
  const user = new Storage({ filename: domain });
  const invoice = user.get('invoices').findOne({ id });

  if (!invoice) return ERROR.NOT_FOUND(res);
  let { tx } = invoice;

  if (!tx) {
    const { satoshis, address } = invoice;
    const response = await fetch(`${BASE_URL}/${address}`).catch((error) => console.error(error));

    if (!response) throw Error('Something wrong');
    tx = await response.json();
  }

  res.json(tx);
};
