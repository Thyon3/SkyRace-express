const mongoose = require('mongoose');
const os = require('os');

const getSystemHealth = () => {
    return {
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: {
            connected: mongoose.connection.readyState === 1,
            name: mongoose.connection.name
        },
        system: {
            platform: os.platform(),
            cpuCount: os.cpus().length,
            freeMemory: Math.round(os.freemem() / 1024 / 1024) + ' MB',
            totalMemory: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
            uptime: Math.round(os.uptime()) + ' seconds'
        }
    };
};

module.exports = { getSystemHealth };
