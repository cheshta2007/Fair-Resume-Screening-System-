const Resume = require('../models/Resume');
const Job = require('../models/Job');
const fs = require('fs');
const path = require('path');

// Mock function to simulate AI-based skill extraction and anonymization
const processResumeWithAI = (text, jobSkills) => {
  // Simple Mock Logic:
  // In reality, this would call Google Cloud Natural Language API or a custom Cloud Function.
  
  // 1. Anonymize (Remove common names/emails/phones - placeholder logic)
  let anonymizedText = text.replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, "[NAME REDACTED]");
  anonymizedText = anonymizedText.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL REDACTED]");
  anonymizedText = anonymizedText.replace(/\d{10,}/g, "[PHONE REDACTED]");

  // 2. Extract Skills (Mock: search for keywords)
  const allPossibleSkills = ['react', 'node', 'javascript', 'python', 'mongodb', 'express', 'css', 'html', 'aws', 'docker', 'typescript', 'sql'];
  const extractedSkills = allPossibleSkills.filter(skill => text.toLowerCase().includes(skill));

  // 3. Calculate Score based on Job Skills
  let matchCount = 0;
  jobSkills.forEach(s => {
    if (extractedSkills.includes(s.toLowerCase())) matchCount++;
  });
  
  const skillMatchPercentage = jobSkills.length > 0 ? (matchCount / jobSkills.length) * 100 : 0;
  const aiScore = Math.min(100, skillMatchPercentage + (extractedSkills.length * 2)); // Bonus for extra skills

  return {
    anonymizedText,
    extractedSkills,
    aiScore: Math.round(aiScore),
    skillMatchPercentage: Math.round(skillMatchPercentage),
    insights: {
      strengths: extractedSkills.slice(0, 3),
      weaknesses: jobSkills.filter(s => !extractedSkills.includes(s.toLowerCase())),
      suggestedImprovements: ["Add more keywords", "Improve formatting", "Highlight relevant projects"]
    }
  };
};

exports.uploadResume = async (req, res) => {
  try {
    const { jobId } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Mock: Read file text (In reality, use a library like 'pdf-parse')
    // For now, we simulate with some dummy text if the file exists.
    const rawText = `Candidate Profile: John Doe, Email: john@example.com, Phone: 1234567890.
                     Skills: React, Node.js, JavaScript, CSS. Experience: 3 years.`;

    const aiResults = processResumeWithAI(rawText, job.requiredSkills);

    const resume = new Resume({
      candidateId: req.user.id,
      jobId,
      filePath: file.path,
      rawText,
      ...aiResults
    });

    await resume.save();
    res.status(201).json({ message: 'Resume uploaded and processed successfully', resume });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.getResumesForHR = async (req, res) => {
  try {
    const resumes = await Resume.find().populate('jobId', 'title');
    // Important: Exclude rawText and file path to maintain anonymity if needed, 
    // or just rely on anonymizedText in the frontend.
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resumes', error: err.message });
  }
};

exports.getCandidateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ candidateId: req.user.id }).populate('jobId', 'title');
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resume', error: err.message });
  }
};
