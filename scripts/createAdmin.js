require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../server/models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create admin user
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@trendvibe.store',
      password: 'admin123!@#',
      isAdmin: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
