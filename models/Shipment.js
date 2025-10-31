const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  refNo: { type: String, required: true, unique: true },
  clientName: String,
  clientPhone: String,
  origin: String,
  destination: String,
  vessel: String,
  etd: String,
  eta: String,
  status: String,
  lastUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Shipment", shipmentSchema);