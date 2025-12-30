const mongoose = require('mongoose');
const Flight = require('./models/Flight');
const dotenv = require('dotenv');

dotenv.config();

const flights = [
    {
        airline: 'SkyRace Air',
        flightNumber: 'SK101',
        origin: 'New York (JFK)',
        destination: 'London (LHR)',
        departureTime: new Date(Date.now() + 86400000), // Tomorrow
        arrivalTime: new Date(Date.now() + 86400000 + 7 * 3600000),
        price: 450,
        currency: 'USD'
    },
    {
        airline: 'SkyRace Air',
        flightNumber: 'SK102',
        origin: 'London (LHR)',
        destination: 'Paris (CDG)',
        departureTime: new Date(Date.now() + 2 * 86400000),
        arrivalTime: new Date(Date.now() + 2 * 86400000 + 2 * 3600000),
        price: 120,
        currency: 'USD'
    },
    {
        airline: 'Oceanic Airlines',
        flightNumber: 'OC815',
        origin: 'Sydney (SYD)',
        destination: 'Los Angeles (LAX)',
        departureTime: new Date(Date.now() + 3 * 86400000),
        arrivalTime: new Date(Date.now() + 3 * 86400000 + 14 * 3600000),
        price: 1200,
        currency: 'USD'
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyrace');
        await Flight.deleteMany({});
        await Flight.insertMany(flights);
        console.log('Database seeded successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
