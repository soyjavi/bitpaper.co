import Storage from 'vanilla-storage';

export default ({ session, props }, res) => {
  const user = new Storage({ filename: session.username });

  user.get('profile').save(props);

  res.json(user.value);
};
