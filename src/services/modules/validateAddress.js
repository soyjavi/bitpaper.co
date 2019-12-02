const bitcoin = require('bitcoinjs-lib');

export default (address) => (address ? bitcoin.address.toOutputScript(address) : undefined);
