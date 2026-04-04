const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobDetails);

module.exports = router;
