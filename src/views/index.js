import { Router } from 'express';

import { cacheHtml, request } from '../middlewares';
import home from './home';
import register from './register';
import login from './login';
import logout from './logout';
import profile from './profile';
import dashboard from './dashboard';
import invoicePreview from './invoice.preview';
import invoice from './invoice';
import qr from './qr';

const router = Router();

// Endpoints
router.get('/register', register);
router.get('/login', login);
router.get('/logout', logout);
router.get('/profile', profile);
router.get('/invoice/:id/preview', request, invoicePreview);
router.get('/invoice/:id', request, invoice);
router.get('/pay/:id', request, invoicePreview);
router.get('/qr/:address/:amount', qr);
router.get('/', (req, res, next) => {
  if (req.session) return dashboard(req, res, next);

  cacheHtml(req, res, next);
  return home(req, res);
});

export default router;
