const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload', auth, upload.single('resume'), resumeController.uploadResume);
router.get('/hr-view', auth, resumeController.getResumesForHR);
router.get('/candidate-view', auth, resumeController.getCandidateResume);
router.put('/test-score', auth, async (req, res) => {
  try {
    const Resume = require('../models/Resume');
    const resume = await Resume.findOneAndUpdate(
      { candidateId: req.user.id }, 
      { $set: { "insights.testScore": req.body.score } }, 
      { new: true }
    );
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
