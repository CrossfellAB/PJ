const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
  organization: { type: String },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  preferences: {
    defaultTherapeuticArea: { type: Schema.Types.ObjectId, ref: 'TherapeuticArea' },
    defaultRegion: { type: Schema.Types.ObjectId, ref: 'Region' },
    notifications: { type: Boolean, default: true }
  }
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);