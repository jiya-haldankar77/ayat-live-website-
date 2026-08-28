// Script to check if admin user exists in MongoDB
import mongoose from 'mongoose';
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

async function checkAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const admin = await Admin.findOne({ email: 'admin@aayatprojects.com' });
    
    if (admin) {
      console.log('✓ Admin user found:');
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
    } else {
      console.log('✗ Admin user not found');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('✗ Error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

checkAdmin();
