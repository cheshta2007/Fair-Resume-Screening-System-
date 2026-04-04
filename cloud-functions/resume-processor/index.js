/**
 * Google Cloud Function: Resume Processor
 * 
 * This function can be deployed to GCP to handle heavy resume parsing
 * and scoring logic outside the main backend.
 */

const { LanguageServiceClient } = require('@google-cloud/language');
const client = new LanguageServiceClient();

exports.processResume = async (req, res) => {
  try {
    const { text, jobSkills } = req.body;
    
    // 1. Skill Extraction using GCP Natural Language API
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
    const [result] = await client.analyzeEntities({ document });
    const entities = result.entities;
    
    // Logic to filter entities for technical skills
    const extractedSkills = entities
      .filter(e => e.type === 'ORGANIZATION' || e.type === 'OTHER')
      .map(e => e.name.toLowerCase());

    // 2. Scoring logic
    let score = 0;
    jobSkills.forEach(skill => {
      if (extractedSkills.includes(skill.toLowerCase())) score += (100 / jobSkills.length);
    });

    res.status(200).json({
      score: Math.round(score),
      skills: [...new Set(extractedSkills)],
      anonymized: text.replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, "[REDACTED]")
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
