import render from '../common/render';

export default (req, res) => {
  if (!req.session) res.redirect('/logout');

  return res.send(
    render('index', {
      page: 'dashboard',
      content: render('dashboard', {
        paid: {},
        unpaid: {},
        drafts: {},
      }),
      scripts: ['dashboard'],
    }),
  );
};
