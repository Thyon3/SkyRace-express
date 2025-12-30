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

app.use('/api/auth', require('./routes/auth'));
app.use('/api/password', require('./routes/password'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));

// Admin Routes
app.use('/api/admin/auth', require('./routes/admin/auth'));
app.use('/api/admin/users', require('./routes/admin/users'));
app.use('/api/admin/bookings', require('./routes/admin/bookings'));
app.use('/api/admin/flights', require('./routes/admin/flights'));
app.use('/api/admin/dashboard', require('./routes/admin/dashboard'));
app.use('/api/admin/payments', require('./routes/admin/payments'));
app.use('/api/admin/revenue', require('./routes/admin/revenue'));
app.use('/api/admin/airlines', require('./routes/admin/airlines'));
app.use('/api/admin/airports', require('./routes/admin/airports'));
app.use('/api/admin/notifications', require('./routes/admin/notifications'));
app.use('/api/admin/profile', require('./routes/admin/profile'));
app.use('/api/admin/system-settings', require('./routes/admin/systemSettings'));
app.use('/api/admin/audit', require('./routes/admin/audit'));

const { errorHandler } = require('./middleware/error');
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Skyrace Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
