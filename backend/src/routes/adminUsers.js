const express = require('express');

const authenticate = require('../middlewares/authenticate');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const adminUserController = require('../controllers/adminUserController');
const { validateListQuery, validateRoleUpdate } = require('../validators/adminUser');

const router = express.Router();

router.use(authenticate, authorizeAdmin);
router.get('/', validateListQuery, adminUserController.list);
router.patch('/:id/role', validateRoleUpdate, adminUserController.updateRole);
router.get('/:id', adminUserController.findById);

module.exports = router;