// src/seeds/seedAdmin.js
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { connectDB } from '../config/db.js';

async function seed() {
  try {
    await connectDB(process.env.MONGO_URI);

    const existing = await Admin.findOne({ email: 'admin@nusantara.com' });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
    const hashed = await bcrypt.hash('P@ssw0rd123', saltRounds);

    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@nusantara.com',
      password: hashed,
      role: 'superadmin'
    });

    await admin.save();
    console.log('Admin seeded:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
