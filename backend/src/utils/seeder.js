const mongoose = require('mongoose');
const User = require('../models/User');

const seedDummyAccounts = async () => {
  try {
    const usersCount = await User.countDocuments();
    
    // Only seed if db is empty
    if (usersCount === 0) {
      console.log('No users found in database. Seeding dummy accounts...');
      
      const users = [
        {
          name: 'Reception Desk',
          email: 'reception@medicore.com',
          password: 'reception123',
          role: 'reception',
        },
        {
          name: 'Dr. Emily Chen',
          email: 'doctor@medicore.com',
          password: 'doctor123',
          role: 'doctor',
          department: 'General Medicine',
        }
      ];

      await User.create(users);
      console.log('Dummy accounts seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedDummyAccounts;
