const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const flightsRoute = require('./routes/flights');

app.use(cors());
app.use(express.json());

app.use('/api/flights', flightsRoute);

app.get('/', (req, res) => {
    res.send('Skyrace Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
