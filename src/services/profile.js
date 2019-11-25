import { decrypt } from 'vanilla-storage/dist/modules';

export default ({ session: { entropy, xpub, ...session } }, res) => res.json({
  ...session,
  xpub: xpub ? decrypt(xpub, entropy) : undefined,
});
