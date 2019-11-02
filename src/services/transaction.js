import fetch from 'node-fetch';

const BASE_URL = 'https://blockstream.info/api/address';

export default async ({ props: { address } }, res) => {
  /*
  @TODO
  1. Find the invoicement using the id && address and username (domain)
  2. ask blockstream
  3. compare if invoice is in memorypool or already confirmed (using the amount)
  */
  const response = await fetch(`${BASE_URL}/${address}`).catch((error) => console.error(error));

  if (!response) throw Error('Something wrong');
  const json = await response.json();

  res.json(json);
};
