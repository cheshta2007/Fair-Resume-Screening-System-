const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
// Change GET to POST for callback
router.post('/google/callback', authController.googleCallback); // ← POST now
router.get('/google', authController.googleLogin); // can keep or remove

module.exports = router;
