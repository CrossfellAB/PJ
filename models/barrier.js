const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BarrierSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['strategic', 'operational', 'standards'], required: true },
  severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  isDropoutPoint: { type: Boolean, default: false },
  therapeuticArea: { type: Schema.Types.ObjectId, ref: 'TherapeuticArea', required: true },
  region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
  affectedStages: [{ type: Schema.Types.ObjectId, ref: 'JourneyTemplate.stages' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Barrier', BarrierSchema);