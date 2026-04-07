const mongoose = require('mongoose');
const User = require('../backend/models/User');
const Job = require('../backend/models/Job');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});

    // Create HR User
    const hr = new User({
      name: 'HR Admin',
      email: 'hr@example.com',
      password: 'password123',
      role: 'hr'
    });
    await hr.save();

    // Create Sample Jobs
    const jobs = [
      {
        title: 'Full Stack Developer',
        description: 'Looking for a dev with React and Node experience.',
        requiredSkills: ['react', 'node', 'javascript', 'mongodb'],
        postedBy: hr._id
      },
      {
        title: 'Python Data Scientist',
        description: 'Expertise in Python and machine learning required.',
        requiredSkills: ['python', 'sql', 'pandas', 'tensorflow'],
        postedBy: hr._id
      },
      {
        title: 'Frontend Engineer',
        description: 'Strong UI/UX skills and React proficiency.',
        requiredSkills: ['react', 'css', 'html', 'javascript', 'typescript'],
        postedBy: hr._id
      }
    ];

    await Job.insertMany(jobs);
    console.log('✅ Seeding complete! HR User: hr@example.com / password123');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
