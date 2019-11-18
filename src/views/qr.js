import tor from 'tor-request';

const BASE_URL = 'https://chart.googleapis.com/chart?cht=qr&chs=256x256&chld=H|0&chl=';

export default ({ params: { address, amount } }, res) => {
  tor.request(
    { url: `${BASE_URL}bitcoin:${address}?amount=${amount}`, strictSSL: true },
    (error, { statusCode }) => {
      if (error) {
        res.writeHead(statusCode);
        res.end();
      }
    },
  ).pipe(res);
};
