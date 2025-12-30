const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyrace')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const flightsRoute = require('./routes/flights');
const bookingsRoute = require('./routes/bookings');
const authRoute = require('./routes/auth');

app.use('/api/flights', flightsRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/auth', authRoute);

const { errorHandler } = require('./middleware/error');
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Skyrace Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
