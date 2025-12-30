require('dotenv').config();
const mongoose = require('mongoose');
const Flight = require('./models/Flight');

const flights = [
    {
        airline: 'SkyRace Air',
        flightNumber: 'SR101',
        origin: 'New York (JFK)',
        destination: 'London (LHR)',
        departureTime: new Date('2024-06-01T10:00:00Z'),
        arrivalTime: new Date('2024-06-01T17:15:00Z'),
        duration: 435,
        price: 450,
        isDirect: true,
    },
    {
        airline: 'Oceanic',
        flightNumber: 'OC815',
        origin: 'London (LHR)',
        destination: 'Paris (CDG)',
        departureTime: new Date('2024-06-02T08:00:00Z'),
        arrivalTime: new Date('2024-06-02T09:15:00Z'),
        duration: 75,
        price: 120,
        isDirect: true,
    },
    {
        airline: 'Global Jet',
        flightNumber: 'GJ202',
        origin: 'Paris (CDG)',
        destination: 'Tokyo (NRT)',
        departureTime: new Date('2024-06-03T12:00:00Z'),
        arrivalTime: new Date('2024-06-04T06:00:00Z'),
        duration: 1080,
        price: 850,
        isDirect: false,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Flight.deleteMany({});
        await Flight.insertMany(flights);

        console.log('Database seeded successfully');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
