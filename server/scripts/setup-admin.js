// Script to create a default admin user
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DEFAULT_ADMIN_EMAIL = 'qinalexander56@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'securepassword123';
const MONGODB_URI =
  'mongodb+srv://qinalexander56:Safaricom360@cluster0.fr14aej.mongodb.net/career_recommender?retryWrites=true&w=majority';

// Function to create admin
const createAdmin = async () => {
  try {
    // Check if required env vars exist
    // if (
    //   !DEFAULT_ADMIN_EMAIL ||
    //   !DEFAULT_ADMIN_PASSWORD
    // ) {
    //   console.error(
    //     'ERROR: DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD must be set in .env file'
    //   );
    //   process.exit(1);
    // }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: DEFAULT_ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log(
        `Admin user with email ${DEFAULT_ADMIN_EMAIL} already exists`
      );
      process.exit(0);
    }

    // Create admin user
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(
    //   DEFAULT_ADMIN_PASSWORD,
    //   salt
    // );

    const admin = await User.create({
      name: 'System Administrator',
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      role: 'admin',
      userType: 'admin',
      emailVerified: true,
    });

    console.log(`Admin user created successfully: ${admin.email}`);

    // Create a file to indicate admin was created
    fs.writeFileSync(
      path.join(__dirname, '..', '.admin-created'),
      new Date().toISOString()
    );

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the function
createAdmin();
