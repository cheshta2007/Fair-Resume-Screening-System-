const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills } = req.body;
    const job = new Job({
      title,
      description,
      requiredSkills,
      postedBy: req.user.id
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job', error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch job details', error: err.message });
  }
};
