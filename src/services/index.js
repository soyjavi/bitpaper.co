import { Router } from 'express';

import { api, request } from '../middlewares';
import signup from './signup';
import login from './login';
import profile from './profile';
import profileUpdate from './profileUpdate';
import invoice from './invoice';
import invoiceCreate from './invoiceCreate';
import invoiceUpdate from './invoiceUpdate';
import invoiceDelete from './invoiceDelete';
import invoiceTx from './invoiceTx';

const router = Router();

// Endpoints
router.post('/signup', api, signup);
router.post('/login', api, login);
router.get('/profile', api, profile);
router.put('/profile', api, profileUpdate);
router.post('/invoice', api, invoiceCreate);
router.get('/invoice/:id/tx', request, api, invoiceTx);
router.get('/invoice/:id', request, api, invoice);
router.put('/invoice/:id', request, api, invoiceUpdate);
router.delete('/invoice/:id', request, api, invoiceDelete);

export default router;
