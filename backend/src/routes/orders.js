const express = require('express');

const authenticate = require('../middlewares/authenticate');
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');
const {
  validateCheckout,
  validateListQuery
} = require('../validators/order');
const { validatePayment } = require('../validators/payment');

const router = express.Router();

router.use(authenticate);

router.post('/', validateCheckout, orderController.create);
router.post('/:id/payment', validatePayment, paymentController.process);
router.get('/', validateListQuery, orderController.list);
router.get('/:id', orderController.findById);

module.exports = router;