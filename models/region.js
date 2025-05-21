const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Healthcare system tiers/levels
const HealthcareTierSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true }
});

// Region schema representing a country or healthcare system
const RegionSchema = new Schema({
  name: { type: String, required: true },
  countryCode: { type: String, required: true }, // ISO country code
  description: { type: String },
  healthcareSystem: { type: String, required: true }, // e.g., "NHS", "Medicare", "Private Insurance"
  healthcareTiers: [HealthcareTierSchema],
  currencyCode: { type: String, required: true }, // For cost calculations
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Region', RegionSchema);