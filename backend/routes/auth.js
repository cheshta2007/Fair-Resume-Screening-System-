const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google/callback', authController.googleCallback); // ← POST, not GET
// Remove: router.get('/google', authController.googleLogin)

module.exports = router;
