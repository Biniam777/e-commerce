const express = require('express');

const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authenticate');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const {
  validateCreate,
  validateListQuery,
  validateUpdate
} = require('../validators/product');

const router = express.Router();

router.get('/', validateListQuery, productController.list);
router.get('/:slug', productController.findBySlug);
router.post('/', authenticate, authorizeAdmin, validateCreate, productController.create);
router.patch('/:id', authenticate, authorizeAdmin, validateUpdate, productController.update);
router.delete('/:id', authenticate, authorizeAdmin, productController.remove);

module.exports = router;