import dotenv from 'dotenv';
import Storage from 'vanilla-storage';

dotenv.config();
const { SECRET: secret } = process.env;

export default ({
  session: { username },
  props: {
    domain, address, xpub, ...props
  },
}, res) => {
  const user = new Storage({ filename: username, secret });
  user.get('profile').save({ ...props, xpub, address: !xpub ? address : undefined });

  res.json(user.value);
};
