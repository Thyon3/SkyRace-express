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
    },
    {
        airline: 'SkyRace Air',
        flightNumber: 'SK102',
        origin: 'London (LHR)',
        destination: 'Paris (CDG)',
        departureTime: new Date(Date.now() + 2 * 86400000),
        arrivalTime: new Date(Date.now() + 2 * 86400000 + 2 * 3600000),
        price: 120,
    },
    {
        airline: 'Oceanic Airlines',
        flightNumber: 'OC815',
        origin: 'Sydney (SYD)',
        destination: 'Los Angeles (LAX)',
        departureTime: new Date(Date.now() + 3 * 86400000),
        arrivalTime: new Date(Date.now() + 3 * 86400000 + 14 * 3600000),
        price: 1200,
    },
];

const seedDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGODB_URI);
        // await Flight.deleteMany({});
        // await Flight.insertMany(flights);
        console.log('Database seeded successfully (Mock)');
        // process.exit();
    } catch (err) {
        console.error(err);
        // process.exit(1);
    }
};

seedDB();
