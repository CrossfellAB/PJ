const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for a journey stage
const StageSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  dropoutRate: { type: Number, default: 0 },
  emotionalState: { type: String },
  tierLevel: { type: String }, // NHS tier or equivalent in other healthcare systems
  activities: [{ type: String }],
  painPoints: [{ type: String }],
  infoSources: [{ type: String }],
  decisionPoints: [{
    name: { type: String, required: true },
    description: { type: String },
    keyFactors: [{ type: String }]
  }]
});

// Schema for stakeholder definitions that can be reused across journeys
const StakeholderSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String }, // e.g., "Healthcare Provider", "Patient", "Payer"
  description: { type: String },
});

// Schema for stakeholder involvement in a specific journey stage
const StakeholderInvolvementSchema = new Schema({
  stakeholder: { type: Schema.Types.ObjectId, ref: 'Stakeholder', required: true },
  stage: { type: Schema.Types.ObjectId, ref: 'Stage' },
  involvement: { type: String, enum: ['High', 'Medium', 'Low'], required: true }
});

// Main Journey Template Schema
const JourneyTemplateSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  therapeuticArea: { type: Schema.Types.ObjectId, ref: 'TherapeuticArea', required: true },
  region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  stages: [StageSchema],
  stakeholderInvolvements: [StakeholderInvolvementSchema]
});

module.exports = mongoose.model('JourneyTemplate', JourneyTemplateSchema);