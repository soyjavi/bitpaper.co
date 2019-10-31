import Storage from 'vanilla-storage';

export default ({ session, props: { location, ...props } }, res) => {
  const user = new Storage({ filename: session.username });

  user
    .get('profile')
    .save({
      ...props,
      location: location ? location.split('|') : session.location,
    });

  res.json(user.value);
};
