const express = require('express');

const authenticate = require('../middlewares/authenticate');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const adminOrderController = require('../controllers/adminOrderController');
const { validateListQuery, validateStatusUpdate } = require('../validators/adminOrder');

const router = express.Router();

router.use(authenticate, authorizeAdmin);
router.get('/', validateListQuery, adminOrderController.list);
router.patch('/:id/status', validateStatusUpdate, adminOrderController.updateStatus);
router.get('/:id', adminOrderController.findById);

module.exports = router;