// Usage: node scripts/seed_demo_data.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import Package from "../packageModel.js";
import Destination from "../models/Destination.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demoDestinations = [
  { name: "Paris", country: "France", slug: "paris", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" },
  { name: "Bali", country: "Indonesia", slug: "bali", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  { name: "Maldives", country: "Maldives", slug: "maldives", imageUrl: "https://images.unsplash.com/photo-1465156799763-2c087c332922" },
  { name: "Switzerland", country: "Switzerland", slug: "switzerland", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" },
  { name: "Dubai", country: "UAE", slug: "dubai", imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29" },
  { name: "Goa", country: "India", slug: "goa", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
  { name: "Singapore", country: "Singapore", slug: "singapore", imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" }
];

const demoPackages = [
  {
    title: "Romantic Paris Getaway",
    destinationSlug: "paris",
    durationDays: 5,
    price: 89999,
    type: "International",
    theme: "Honeymoon",
    summary: "Experience the romance of Paris with guided tours, Seine cruise, and Eiffel Tower dinner.",
    images: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34"],
    highlights: ["Eiffel Tower Dinner", "Seine River Cruise", "Louvre Museum"],
    itineraryOutline: [
      { day: 1, title: "Arrival & City Tour", details: "Arrive in Paris, evening city tour." },
      { day: 2, title: "Eiffel Tower & Cruise", details: "Visit Eiffel Tower, Seine cruise." },
      { day: 3, title: "Louvre & Shopping", details: "Explore Louvre, shopping at Champs-Élysées." },
      { day: 4, title: "Versailles", details: "Day trip to Palace of Versailles." },
      { day: 5, title: "Departure", details: "Free time, then airport transfer." }
    ],
    isBestSeller: true
  },
  {
    title: "Bali Family Adventure",
    destinationSlug: "bali",
    durationDays: 6,
    price: 74999,
    type: "International",
    theme: "Family",
    summary: "Fun-filled Bali trip with water sports, temples, and beach resorts for the whole family.",
    images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb"],
    highlights: ["Water Sports", "Uluwatu Temple", "Beach Resort"],
    itineraryOutline: [
      { day: 1, title: "Arrival & Beach", details: "Arrive, relax at Kuta Beach." },
      { day: 2, title: "Water Sports", details: "Enjoy water sports at Tanjung Benoa." },
      { day: 3, title: "Ubud Tour", details: "Visit Ubud Monkey Forest, rice terraces." },
      { day: 4, title: "Temples", details: "Uluwatu & Tanah Lot temples." },
      { day: 5, title: "Leisure Day", details: "Free day at resort." },
      { day: 6, title: "Departure", details: "Check out, airport transfer." }
    ],
    isPopular: true
  },
  {
    title: "Maldives Luxury Escape",
    destinationSlug: "maldives",
    durationDays: 4,
    price: 119999,
    type: "International",
    theme: "Honeymoon",
    summary: "Stay in an overwater villa, enjoy snorkeling, spa, and candlelight dinners in Maldives.",
    images: ["https://images.unsplash.com/photo-1465156799763-2c087c332922"],
    highlights: ["Overwater Villa", "Snorkeling", "Spa"],
    itineraryOutline: [
      { day: 1, title: "Arrival & Resort", details: "Arrive, transfer to resort, relax." },
      { day: 2, title: "Snorkeling", details: "Guided snorkeling tour." },
      { day: 3, title: "Spa & Leisure", details: "Spa session, leisure time." },
      { day: 4, title: "Departure", details: "Check out, airport transfer." }
    ],
    isBestSeller: true
  },
  {
    title: "Swiss Alps Explorer",
    destinationSlug: "switzerland",
    durationDays: 7,
    price: 139999,
    type: "International",
    theme: "Adventure",
    summary: "Explore the Swiss Alps with scenic train rides, mountain hikes, and chocolate tasting.",
    images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"],
    highlights: ["Scenic Train", "Mountain Hikes", "Chocolate Tour"],
    itineraryOutline: [
      { day: 1, title: "Zurich Arrival", details: "Arrive, city tour." },
      { day: 2, title: "Lucerne", details: "Visit Lucerne, lake cruise." },
      { day: 3, title: "Interlaken", details: "Train to Interlaken, explore town." },
      { day: 4, title: "Jungfrau", details: "Day trip to Jungfraujoch." },
      { day: 5, title: "Bern", details: "Visit Bern, old town walk." },
      { day: 6, title: "Chocolate Tour", details: "Swiss chocolate factory tour." },
      { day: 7, title: "Departure", details: "Free time, then airport transfer." }
    ]
  },
  {
    title: "Goa Beach Break",
    destinationSlug: "goa",
    durationDays: 4,
    price: 24999,
    type: "India",
    theme: "Group",
    summary: "Relax on Goa's beaches, enjoy nightlife, and explore Portuguese heritage sites.",
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"],
    highlights: ["Beaches", "Nightlife", "Heritage Sites"],
    itineraryOutline: [
      { day: 1, title: "Arrival & Beach", details: "Arrive, relax at Baga Beach." },
      { day: 2, title: "Old Goa", details: "Visit churches, heritage walk." },
      { day: 3, title: "Nightlife", details: "Beach party, clubbing." },
      { day: 4, title: "Departure", details: "Shopping, airport transfer." }
    ],
    isPopular: true
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Seed destinations
  await Destination.deleteMany({});
  const destDocs = await Destination.insertMany(demoDestinations);
  const destMap = Object.fromEntries(destDocs.map(d => [d.slug, d._id]));
  console.log('Seeded destinations:', destDocs.length);

  // Seed packages
  await Package.deleteMany({});
  for (const pkg of demoPackages) {
    const slug = pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const doc = { ...pkg, destination: destMap[pkg.destinationSlug], slug };
    delete doc.destinationSlug;
    await Package.create(doc);
  }
  console.log('Seeded packages:', demoPackages.length);

  await mongoose.disconnect();
  console.log('Done!');
}

seed();
