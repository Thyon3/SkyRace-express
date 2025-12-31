const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SystemSetting = require('./models/SystemSetting');

dotenv.config();

const settings = [
    {
        key: 'REVENUE_SHARE_PERCENT',
        value: '10',
        description: 'Percentage of revenue share for the platform'
    },
    {
        key: 'LOYALTY_POINTS_PER_DOLLAR',
        value: '5',
        description: 'Number of loyalty points earned per dollar spent'
    },
    {
        key: 'MAINTENANCE_MODE',
        value: 'false',
        description: 'Toggle system maintenance mode'
    },
    {
        key: 'SUPPORT_EMAIL',
        value: 'support@skyrace.com',
        description: 'Primary support contact email'
    }
];

const seedSettings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skyrace');
        console.log('Connected to MongoDB');

        for (const s of settings) {
            await SystemSetting.findOneAndUpdate(
                { key: s.key },
                s,
                { upsert: true, new: true }
            );
        }

        console.log('System settings seeded successfully');
        process.exit();
    } catch (err) {
        console.error('Error seeding settings:', err);
        process.exit(1);
    }
};

seedSettings();
