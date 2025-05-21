const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScenarioResultSchema = new Schema({
  baselineDropoutRate: { type: Number },
  projectedDropoutRate: { type: Number },
  improvementPercentage: { type: Number },
  patientImpact: { type: String, enum: ['High', 'Medium', 'Low'] },
  systemImpact: { type: String, enum: ['High', 'Medium', 'Low'] },
  implementationEffort: { type: Number },
  impactedStages: [{ type: Schema.Types.ObjectId, ref: 'JourneyTemplate.stages' }],
  costProjection: { type: Number },
  timelineEstimate: { type: Number }, // In months
  additionalMetrics: Schema.Types.Mixed // Flexible field for additional calculated metrics
});

const ScenarioSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  journeyTemplate: { type: Schema.Types.ObjectId, ref: 'JourneyTemplate', required: true },
  selectedInterventions: [{ type: Schema.Types.ObjectId, ref: 'Intervention' }],
  removedBarriers: [{ type: Schema.Types.ObjectId, ref: 'Barrier' }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'finalized', 'archived'], default: 'draft' },
  isShared: { type: Boolean, default: false },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  calculationResults: ScenarioResultSchema,
  notes: { type: String }
});

module.exports = mongoose.model('Scenario', ScenarioSchema);