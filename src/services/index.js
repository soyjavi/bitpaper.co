import { Router } from 'express';

import { api, invoice, request } from '../server/middlewares';
import signup from './signup';
import login from './login';
import profile from './profile';
import profileUpdate from './profileUpdate';
import search from './search';
import invoiceRead from './invoiceRead';
import invoiceCreate from './invoiceCreate';
import invoiceUpdate from './invoiceUpdate';
import invoiceDelete from './invoiceDelete';
import invoiceTx from './invoiceTx';

const router = Router();

// Endpoints
router.post('/signup', api, signup);
router.post('/login', api, login);
router.get('/search', api, search);
router.get('/profile', api, profile);
router.put('/profile', api, profileUpdate);
router.post('/invoice', api, invoiceCreate);
router.get('/invoice/:id/tx', request, api, invoice, invoiceTx);
router.get('/invoice/:id', request, api, invoice, invoiceRead);
router.put('/invoice/:id', request, api, invoice, invoiceUpdate);
router.delete('/invoice/:id', request, api, invoice, invoiceDelete);

export default router;
