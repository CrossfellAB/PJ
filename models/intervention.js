const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InterventionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  implementationComplexity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  impactAreas: [{ type: String }], // Names of journey stages this impacts
  stakeholdersBenefited: [{ type: String }], // Stakeholder categories that benefit
  potentialOutcomes: [{ type: String }],
  therapeuticArea: { type: Schema.Types.ObjectId, ref: 'TherapeuticArea', required: true },
  region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
  // Reference to specific barriers this intervention addresses
  addressedBarriers: [{ type: Schema.Types.ObjectId, ref: 'Barrier' }],
  // Estimated impact values for scenario modeling
  impactMetrics: {
    dropoutReduction: { type: Number }, // Percentage reduction
    costSavings: { type: Number },
    timeReduction: { type: Number },
    patientSatisfactionImprovement: { type: Number }
  },
  implementationSteps: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' }
});

module.exports = mongoose.model('Intervention', InterventionSchema);