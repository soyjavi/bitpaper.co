import { fetch } from './modules';
// import countdown from './modules/countdown';

console.log('payment.js');

const INTERVAL = setInterval(() => {
  fetch({ service: 'api/transaction/?' })
    .then((json) => {
      console.log(new Date(), json);
    })
    .catch((error) => {
      console.error(new Date(), error);
    });
}, 10000);

// countdown('Nov 1 2020', ({ minutes, seconds }) => {
//   console.log({ minutes, seconds });
// });

// const paymentInterval = setInterval(() => {
//   console.log(new Date());
// }, 10000);
