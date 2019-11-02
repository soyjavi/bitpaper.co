import { Router } from 'express';

import { api, request } from '../middlewares';
import signup from './signup';
import login from './login';
import profile from './profile';
import profileUpdate from './profileUpdate';
import invoice from './invoice';
import invoiceUpdate from './invoiceUpdate';
import transaction from './transaction';

const router = Router();

// Endpoints
router.post('/signup', api, signup);
router.post('/login', api, login);
router.get('/profile', api, profile);
router.put('/profile', api, profileUpdate);
router.post('/invoice', api, invoice);
router.put('/invoice', api, invoiceUpdate);
router.get('/transaction/:address', request, api, transaction);

export default router;
