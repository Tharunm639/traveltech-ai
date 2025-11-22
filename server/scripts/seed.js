import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import Destination from '../models/Destination.js';
import Package from '../models/Package.js';

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traveltech';

async function seed() {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB for seeding');

    const destData = JSON.parse(fs.readFileSync(path.resolve('./data/seedDestinations.json'), 'utf8'));
    const pkgData = JSON.parse(fs.readFileSync(path.resolve('./data/seedPackages.json'), 'utf8'));

    // Clear existing
    await Destination.deleteMany({});
    await Package.deleteMany({});

    // Insert destinations and keep map of slug -> _id
    const insertedDest = await Destination.insertMany(destData);
    const slugToId = {};
    insertedDest.forEach(d => (slugToId[d.slug] = d._id));

    // Prepare packages: replace destinationSlug with destination ObjectId
    const pkgsToInsert = pkgData.map(p => {
      const destId = slugToId[p.destinationSlug];
      return {
        title: p.title,
        slug: p.slug,
        destination: destId,
        price: p.price,
        durationDays: p.durationDays,
        type: p.type,
        images: p.images,
        summary: p.summary,
        itineraryOutline: p.itineraryOutline,
        tags: p.tags,
        featured: p.featured || false,
      };
    });

    await Package.insertMany(pkgsToInsert);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
