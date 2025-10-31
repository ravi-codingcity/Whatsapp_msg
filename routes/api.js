const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// Get all shipments
router.get('/shipments', async (req, res) => {
    try {
        const shipments = await Shipment.find()
            .sort({ lastUpdate: -1 })
            .limit(100);
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get shipment by reference number
router.get('/shipments/:refNo', async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ 
            refNo: req.params.refNo.toUpperCase() 
        });
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        res.json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
