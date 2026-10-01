const express = require('express');

const categoryController = require('../controllers/categoryController');
const authenticate = require('../middlewares/authenticate');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const { validateCreate, validateUpdate } = require('../validators/category');

const router = express.Router();

router.get('/', categoryController.list);
router.get('/:slug', categoryController.findBySlug);
router.post('/', authenticate, authorizeAdmin, validateCreate, categoryController.create);
router.patch('/:id', authenticate, authorizeAdmin, validateUpdate, categoryController.update);
router.delete('/:id', authenticate, authorizeAdmin, categoryController.remove);

module.exports = router;