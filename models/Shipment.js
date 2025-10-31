const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  BLNo: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  clientName: { 
    type: String,
    trim: true 
  },
  clientPhone: { 
    type: String,
    trim: true 
  },
  origin: String,
  destination: String,
  vessel: String,
  etd: String,
  eta: String,
  status: {
    type: String,
    default: 'Pending'
  },
  lastUpdate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  versionKey: false
});

// Add compound index for better querying
shipmentSchema.index({ BLNo: 1, clientPhone: 1 });

// Pre-save middleware to ensure BLNo is not null
shipmentSchema.pre('save', function(next) {
  if (!this.BLNo) {
    next(new Error('BLNo is required'));
  }
  next();
});

module.exports = mongoose.model("Shipment", shipmentSchema);