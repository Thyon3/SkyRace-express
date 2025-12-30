const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const app = express();
app.use(morgan('dev'));
const PORT = process.env.PORT || 5000;

const flightsRoute = require('./routes/flights');
const bookingsRoute = require('./routes/bookings');
const authRoute = require('./routes/auth');

app.use(cors());
app.use(express.json());

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
