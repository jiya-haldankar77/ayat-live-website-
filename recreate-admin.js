// Script to recreate admin user in MongoDB with verification
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

async function recreateAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@aayatprojects.com';
    const password = 'AayatAdmin2026!';

    // Delete existing admin if exists
    await Admin.deleteOne({ email });
    console.log('Deleted existing admin user');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✓ Admin user recreated successfully');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password:', password);

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password);
    console.log('Password verification:', isValid ? '✓ Valid' : '✗ Invalid');

    await mongoose.connection.close();
  } catch (error) {
    console.error('✗ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

recreateAdmin();
