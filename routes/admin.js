const express = require('express');
const router = express.Router();

// Store last 50 webhook calls
const webhookLogs = [];
const MAX_LOGS = 50;

// Add log entry
const addLog = (data) => {
    webhookLogs.unshift({
        timestamp: new Date(),
        data
    });
    if (webhookLogs.length > MAX_LOGS) webhookLogs.pop();
};

// Server status route
router.get('/status', (req, res) => {
    res.json({
        status: 'running',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        webhookCount: webhookLogs.length
    });
});

// View webhook logs
router.get('/logs', (req, res) => {
    res.json(webhookLogs);
});

// Clear logs
router.delete('/logs', (req, res) => {
    webhookLogs.length = 0;
    res.json({ message: 'Logs cleared' });
});

module.exports = { router, addLog };
