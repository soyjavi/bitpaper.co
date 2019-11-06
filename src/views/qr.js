import https from 'https';

export default ({ params: { address, amount } }, res) => {
  https.request({
    host: 'chart.googleapis.com',
    path: `/chart?cht=qr&chs=256x256&chld=H|0&chl=bitcoin:${address}?amount=${amount}`,
  }, (response) => {
    if (response.statusCode === 200) {
      res.writeHead(200, {
        'Content-Type': response.headers['content-type'],
      });
      response.pipe(res);
    } else {
      res.writeHead(response.statusCode);
      res.end();
    }
  }).end();
};
