const express = require('express');

const authenticate = require('../middlewares/authenticate');
const cartController = require('../controllers/cartController');
const { validateAdd, validateUpdate } = require('../validators/cart');

const router = express.Router();

router.use(authenticate);
router.get('/', cartController.get);
router.post('/items', validateAdd, cartController.addItem);
router.patch('/items/:id', validateUpdate, cartController.updateItem);
router.delete('/items/:id', cartController.removeItem);

module.exports = router;