const express = require('express');

const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const { validateLogin, validateRegister } = require('../validators/auth');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;