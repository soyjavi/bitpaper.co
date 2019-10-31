import { Router } from 'express';

import { api, request } from '../middlewares';
import signup from './signup';
import login from './login';
import profile from './profile';
import profileUpdate from './profileUpdate';
import invoice from './invoice';
import transaction from './transaction';

const middlewares = [request, api];
const router = Router();

// Endpoints
router.post('/signup', ...middlewares, signup);
router.post('/login', ...middlewares, login);

router.get('/profile', ...middlewares, profile);
router.put('/profile', ...middlewares, profileUpdate);
router.post('/invoice', ...middlewares, invoice);
// router.put('/invoice', ...middlewares, invoice);
router.get('/transaction/:address', ...middlewares, transaction);

export default router;
