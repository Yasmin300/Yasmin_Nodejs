import { Router } from 'express';

import card from './card.js';
const router = Router();

router.use('/', card);
export default router;
