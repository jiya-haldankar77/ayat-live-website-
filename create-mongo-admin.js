// Script to create admin user in MongoDB
// Run with: node create-mongo-admin.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://jiyahaldankar777_db_user:W1Kaiz8rnpzsHXzq@cluster0.4om1awa.mongodb.net/?appName=Cluster0';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@aayatprojects.com';
    const password = 'AayatAdmin2026!';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✓ Admin user created successfully');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password:', password);

    await mongoose.connection.close();
  } catch (error) {
    console.error('✗ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();
