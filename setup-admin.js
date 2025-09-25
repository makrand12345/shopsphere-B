// Admin Setup Script for ShopSphere
// Run this script to create an admin user: node setup-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function createAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@shopsphere.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email: admin@shopsphere.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopsphere.com',
      passwordHash,
      role: 'admin'
    });

    console.log('🎉 Admin user created successfully!');
    console.log('Email: admin@shopsphere.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('\nYou can now login and access /admin dashboard');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from database');
  }
}

createAdmin();
