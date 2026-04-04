const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  
  // Storage paths
  filePath: { type: String, required: true },
  rawText: { type: String },
  
  // Anonymized data for HR
  anonymizedText: { type: String },
  extractedSkills: [{ type: String }],
  experienceYears: { type: Number, default: 0 },
  
  // AI Scoring
  aiScore: { type: Number, min: 0, max: 100 },
  skillMatchPercentage: { type: Number },
  insights: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestedImprovements: [{ type: String }]
  },
  
  status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
