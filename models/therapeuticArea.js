const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TherapeuticAreaSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  code: { type: String }, // Optional standardized code (e.g., ICD-10)
  parentArea: { type: Schema.Types.ObjectId, ref: 'TherapeuticArea' }, // For hierarchical categorization
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

module.exports = mongoose.model('TherapeuticArea', TherapeuticAreaSchema);