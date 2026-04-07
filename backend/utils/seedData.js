const User = require('../models/User');
const Job = require('../models/Job');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      // Create users one by one to trigger 'pre-save' hooks for bcrypt
      const hr = new User({ 
        name: 'HR Manager', 
        email: 'hr@example.com', 
        password: 'password123', 
        role: 'hr' 
      });
      const candidate = new User({ 
        name: 'John Doe', 
        email: 'candidate@example.com', 
        password: 'password123', 
        role: 'candidate' 
      });
      await hr.save();
      await candidate.save();
      console.log('✅ Sample Users Created (hr@example.com, candidate@example.com / password123)');
    }

    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      const hrUser = await User.findOne({ role: 'hr' });
      if (hrUser) {
        const jobs = [
          { 
            title: 'Full Stack Developer', 
            description: 'Looking for a React and Node.js expert.', 
            requiredSkills: ['react', 'node', 'javascript', 'mongodb'],
            postedBy: hrUser._id
          },
          { 
            title: 'Frontend Engineer', 
            description: 'UI/UX focused role.', 
            requiredSkills: ['react', 'css', 'html', 'typescript'],
            postedBy: hrUser._id
          }
        ];
        await Job.insertMany(jobs);
        console.log('✅ Sample Jobs Created');
      }
    }
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
  }
};

module.exports = seedData;
