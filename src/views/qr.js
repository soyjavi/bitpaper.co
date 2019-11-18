import tor from 'tor-request';

const BASE_URL = 'http://chart.googleapis.com/chart?cht=qr&chs=256x256&chld=H|0&chl=';

export default ({ params: { address, amount } }, res) => {
  tor.request(`${BASE_URL}bitcoin:${address}?amount=${amount}`, (error, response) => {
    if (response.statusCode === 200) {
      const { headers = {} } = response;

      res.writeHead(200, { 'Content-Type': headers['content-type'] });
      response.pipe(res);
    } else {
      res.writeHead(response.statusCode);
      res.end();
    }
  });
};
