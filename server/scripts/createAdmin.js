#!/usr/bin/env node
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = process.argv[i+1] && !process.argv[i+1].startsWith('--') ? process.argv[++i] : true;
      args[k] = v;
    }
  }
  return args;
}

async function main() {
  const { email, password, name } = parseArgs();
  if (!email || !password) {
    console.error('Usage: node createAdmin.js --email admin@example.com --password secret [--name Admin]');
    process.exit(1);
  }

  const mongo = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traveltech';
  await mongoose.connect(mongo);
  console.log('Connected to MongoDB for admin creation');

  let user = await User.findOne({ email });
  if (user) {
    user.role = 'admin';
    if (password) user.password = password;
    if (name) user.name = name;
    await user.save();
    console.log('Updated existing user to admin:', user.email);
  } else {
    user = new User({ name: name || 'Admin', email, password, role: 'admin' });
    await user.save();
    console.log('Created new admin user:', user.email);
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  console.log('\nUse this JWT for Authorization header (Bearer <token>):\n');
  console.log(token);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
