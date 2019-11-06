import {
  C, mail, render,
} from '../common';

export default async (req, res) => {
  // let error = false;

  // const amountBTC = await rateBTC(COURSE_DISCOUNT_FIAT);

  // await mail({
  //   to: email,
  //   subject: 'Hemos recibido tu reserva',
  //   text: render('templates/mailPayment', { address, amount: amountBTC }),
  // }).catch(() => { error = true; });

  // await mail({
  //   subject: 'Nuevo pago - AprendeBlockchain',
  //   text: render('templates/mailPaymentAdmin', { address, email, amount: amountBTC }),
  // }).catch(() => { error = true; });

  // res.json({
  //   success: !error,
  //   email,
  //   address,
  // });

  res.json({ file: 'payment.js' });
};
