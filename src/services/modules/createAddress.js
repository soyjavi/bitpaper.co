const bitcoin = require('bitcoinjs-lib');

export default (xpub, invoices = []) => {
  const usedAddresses = invoices.map(({ address }) => address);
  const node = bitcoin.bip32.fromBase58(xpub, bitcoin.networks.bitcoin);
  const receiveBase = node.derive(0);

  let newAddress;
  let i = 0;
  while (!newAddress) {
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: receiveBase.derive(i).publicKey,
      network: bitcoin.networks.bitcoin,
    });

    if (!usedAddresses.includes(address)) newAddress = address;
    i += 1;
  }

  return newAddress;
};
