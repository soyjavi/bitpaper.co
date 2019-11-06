export default (req, res) => {
  res.clearCookie('authorization');
  res.clearCookie('username');
  res.redirect('/');
};
