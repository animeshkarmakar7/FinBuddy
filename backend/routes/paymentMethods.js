import express from 'express';
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../controllers/paymentMethodController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/').get(getPaymentMethods).post(createPaymentMethod);

router.route('/:id').put(updatePaymentMethod).delete(deletePaymentMethod);

export default router;
