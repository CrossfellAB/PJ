const mongoose = require('mongoose');
const connectDB = require('../config/database');
const TherapeuticArea = require('../models/therapeuticArea');
const Region = require('../models/region');
const JourneyTemplate = require('../models/journeyTemplate');
const Barrier = require('../models/barrier');
const Intervention = require('../models/intervention');
const User = require('../models/user');

// Sample data for seeding the database
const seedData = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    console.log('Clearing existing data...');
    await Promise.all([
      TherapeuticArea.deleteMany({}),
      Region.deleteMany({}),
      JourneyTemplate.deleteMany({}),
      Barrier.deleteMany({}),
      Intervention.deleteMany({}),
      User.deleteMany({})
    ]);
    
    console.log('Adding therapeutic areas...');
    const obesity = await TherapeuticArea.create({
      name: 'Obesity',
      description: 'Treatment and management of obesity and related conditions',
      code: 'E66'
    });
    
    const diabetes = await TherapeuticArea.create({
      name: 'Type 2 Diabetes',
      description: 'Management of type 2 diabetes mellitus',
      code: 'E11'
    });
    
    console.log('Adding regions...');
    const ukRegion = await Region.create({
      name: 'United Kingdom',
      countryCode: 'GB',
      description: 'UK healthcare system focusing on NHS pathways',
      healthcareSystem: 'NHS',
      currencyCode: 'GBP',
      healthcareTiers: [
        { name: 'Self-Management', description: 'Patient-led care', order: 1 },
        { name: 'Tier 1', description: 'Primary care and community interventions', order: 2 },
        { name: 'Tier 2', description: 'Community weight management services', order: 3 },
        { name: 'Tier 3', description: 'Specialist weight management services', order: 4 },
        { name: 'Tier 4', description: 'Bariatric surgery', order: 5 },
        { name: 'Follow-up Care', description: 'Long-term management and support', order: 6 }
      ]
    });
    
    const usRegion = await Region.create({
      name: 'United States',
      countryCode: 'US',
      description: 'US healthcare system with mixed public/private coverage',
      healthcareSystem: 'Mixed Insurance',
      currencyCode: 'USD',
      healthcareTiers: [
        { name: 'Self-Management', description: 'Patient-directed care', order: 1 },
        { name: 'Primary Care', description: 'Primary care physician interventions', order: 2 },
        { name: 'Specialist Care', description: 'Endocrinologist and obesity specialist care', order: 3 },
        { name: 'Surgical Options', description: 'Bariatric surgery evaluation and procedures', order: 4 },
        { name: 'Long-term Management', description: 'Ongoing care post-intervention', order: 5 }
      ]
    });
    
    console.log('Adding admin user...');
    await User.create({
      email: 'admin@patientjourney.com',
      password: 'password123', // This will be hashed by the pre-save hook
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    
    console.log('Creating journey templates...');
    // We'd add more complex data here based on the existing prototype
    // For brevity, this is just a placeholder
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedData();