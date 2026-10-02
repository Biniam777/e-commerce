const express = require('express');

const authenticate = require('../middlewares/authenticate');
const orderController = require('../controllers/orderController');
const { validateCheckout, validateListQuery } = require('../validators/order');

const router = express.Router();

router.use(authenticate);
router.post('/', validateCheckout, orderController.create);
router.get('/', validateListQuery, orderController.list);
router.get('/:id', orderController.findById);

module.exports = router;