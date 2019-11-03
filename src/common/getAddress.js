const bitcoin = require('bitcoinjs-lib');

export default (invoice, { xpub }) => {
  if (invoice.address) return invoice.address;
  if (!xpub) return undefined;

  const node = bitcoin.bip32.fromBase58(xpub, bitcoin.networks.bitcoin);
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

  return address;
};
