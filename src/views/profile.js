import { render } from '../server/modules';

export default ({ session }, res) => {
  if (!session) return res.redirect('/');

  return res.send(render('index', {
    page: 'profile',
    content: render('profile'),
    scripts: ['profile'],
  }));
};
