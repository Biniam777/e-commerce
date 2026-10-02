const express = require('express');

const authenticate = require('../middlewares/authenticate');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const adminDashboardController = require('../controllers/adminDashboardController');

const router = express.Router();

router.get('/dashboard', authenticate, authorizeAdmin, adminDashboardController.get);

module.exports = router;