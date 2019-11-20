export default ({ session: { entropy, ...session } }, res) => {
  res.json(session);
};
