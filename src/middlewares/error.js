import render from '../common/render';

export default (error, req, res, next) => {
  if (res.headersSent) next(error);
  else {
    const { code = res.statusCode || 400 } = error;
    const html = render('index', {
      page: 'error',
      context: 'error',
      content: render('error', {
        code,
        message: error.message,
      }),
    });

    res.status(code).send(html);
  }
};
