const Resume = require('../models/Resume');
const Job = require('../models/Job');
const fs = require('fs');
const path = require('path');
// ✅ REMOVED: const pdf = require('pdf-parse'); ← was crashing entire server on startup
const language = require('@google-cloud/language');

// Initialize Google Cloud Language Client
let client;
try {
  client = new language.LanguageServiceClient();
} catch (err) {
  console.warn('Google Cloud Language client failed to initialize. Falling back to mock scoring.', err.message);
}

// Robust Anonymization Logic
const anonymizeText = (text) => {
  let anonymized = text;
  
  // 1. Remove Emails
  anonymized = anonymized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL REDACTED]");
  
  // 2. Remove Phone Numbers (various formats)
  anonymized = anonymized.replace(/(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, "[PHONE REDACTED]");
  
  // 3. Remove URLs
  anonymized = anonymized.replace(/https?:\/\/\S+|www\.\S+/g, "[URL REDACTED]");
  
  // 4. Remove common name patterns (Very basic - better with NLP)
  // In a production environment, use Google Cloud DLP for this.
  const commonNamesPattern = /\b(Name|Name:)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/gi;
  anonymized = anonymized.replace(commonNamesPattern, "[NAME REDACTED]");

  return anonymized;
};

// Skill extraction using Google Cloud Language API (or fallback)
const extractSkillsAndScore = async (text, jobSkills) => {
  let extractedSkills = [];
  let aiScore = 0;
  let skillMatchPercentage = 0;

  if (client) {
    try {
      const document = {
        content: text,
        type: 'PLAIN_TEXT',
      };

      // Use Entity Analysis to find organizations and other information
      const [result] = await client.analyzeEntities({ document });
      const entities = result.entities;

      // Filter entities that look like skills (Mock logic: matches jobSkills)
      entities.forEach(entity => {
        if (jobSkills.some(s => s.toLowerCase() === entity.name.toLowerCase())) {
          extractedSkills.push(entity.name);
        }
      });
    } catch (err) {
      console.error('Google Cloud API call failed:', err.message);
    }
  }

  // Fallback: Keyword search if API fails or returns nothing
  if (extractedSkills.length === 0) {
    const allPossibleSkills = ['react', 'node', 'javascript', 'python', 'mongodb', 'express', 'css', 'html', 'aws', 'docker', 'typescript', 'sql', 'next.js', 'redux'];
    extractedSkills = allPossibleSkills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
  }

  // Final Scoring Logic
  const uniqueExtracted = [...new Set(extractedSkills)];
  let matchCount = 0;
  jobSkills.forEach(s => {
    if (uniqueExtracted.some(es => es.toLowerCase() === s.toLowerCase())) {
      matchCount++;
    }
  });

  skillMatchPercentage = jobSkills.length > 0 ? (matchCount / jobSkills.length) * 100 : 0;
  
  // Weights: 70% Skill Match, 30% Breadth of Skills (extra skills)
  const breadthBonus = Math.min(30, (uniqueExtracted.length - matchCount) * 5);
  aiScore = Math.min(100, (skillMatchPercentage * 0.7) + breadthBonus);

  return {
    extractedSkills: uniqueExtracted,
    aiScore: Math.round(aiScore),
    skillMatchPercentage: Math.round(skillMatchPercentage),
    insights: {
      strengths: uniqueExtracted.slice(0, 5),
      weaknesses: jobSkills.filter(s => !uniqueExtracted.some(es => es.toLowerCase() === s.toLowerCase())),
      suggestedImprovements: [
        "Include more quantifiable metrics for your skills.",
        "Consider getting certifications for missing job requirements.",
        "Highlight projects that use the required tech stack."
      ]
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

    // ✅ FIX: Lazy-load pdf-parse INSIDE the function, not at the top of the file.
    // This prevents it from crashing the entire server on startup in Vercel's
    // serverless environment which lacks browser APIs (DOMMatrix, ImageData, etc.)
    const pdf = require('pdf-parse');

    // 1. Read Text from PDF
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdf(dataBuffer);
    const rawText = data.text;

    // 2. Anonymize
    const anonymizedText = anonymizeText(rawText);

    // 3. Extract & Score
    const aiResults = await extractSkillsAndScore(rawText, job.requiredSkills);

    const resume = new Resume({
      candidateId: req.user.id,
      jobId,
      filePath: file.path,
      rawText,
      anonymizedText,
      ...aiResults
    });

    await resume.save();
    res.status(201).json({ message: 'Resume uploaded and processed successfully', resume });
  } catch (err) {
    console.error('Resume processing error:', err);
    res.status(500).json({ message: 'Upload and processing failed', error: err.message });
  }
};

exports.getResumesForHR = async (req, res) => {
  try {
    // HR Dashboard only gets anonymized data
    const resumes = await Resume.find().populate('jobId', 'title requiredSkills');
    const safeResumes = resumes.map(r => ({
      _id: r._id,
      jobTitle: r.jobId ? r.jobId.title : 'Unknown Job',
      anonymizedText: r.anonymizedText,
      extractedSkills: r.extractedSkills,
      aiScore: r.aiScore,
      skillMatchPercentage: r.skillMatchPercentage,
      insights: r.insights,
      status: r.status,
      createdAt: r.createdAt
    }));
    res.json(safeResumes);
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

exports.updateResumeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const resume = await Resume.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Status updated', resume });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};