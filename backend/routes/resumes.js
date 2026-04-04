const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', auth, upload.single('resume'), resumeController.uploadResume);
router.get('/hr-view', auth, resumeController.getResumesForHR);
router.get('/candidate-view', auth, resumeController.getCandidateResume);

module.exports = router;
