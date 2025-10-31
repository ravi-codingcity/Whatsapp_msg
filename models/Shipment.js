const mongoose = require('mongoose');

// Drop existing indexes first
const dropIndexes = async () => {
  try {
    await mongoose.model('Shipment').collection.dropIndex('refNo_1');
    console.log('Old index dropped successfully');
  } catch (err) {
    console.log('No old index to drop');
  }
};

const shipmentSchema = new mongoose.Schema({
  BLNo: { 
    type: String, 
    required: [true, 'BL Number is required'],
    unique: true,
    trim: true,
    index: true
  },
  clientName: { 
    type: String,
    required: [true, 'Client name is required'],
    trim: true 
  },
  clientPhone: { 
    type: String,
    required: [true, 'Client phone is required'],
    trim: true 
  },
  origin: {
    type: String,
    required: [true, 'Origin is required']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required']
  },
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
  versionKey: false,
  strict: true // Only allow defined fields
});

// Clear all indexes and create new ones
shipmentSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      await dropIndexes();
    } catch (error) {
      console.log('Index drop error:', error);
    }
  }
  next();
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;