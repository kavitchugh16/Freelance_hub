// server/models/Project.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, maxlength: 5000 },
  category: {
    type: String,
    required: true,
    enum: ['Web Development','Mobile Development','Graphic Design','Content Writing','Digital Marketing','Other'],
    default: 'Other'
  },
  clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requiredSkills: { type: [String], required: true },
  experienceLevel: { type: String, enum: ['Entry-Level','Intermediate','Expert'], required: true },
  budget: {
    type: {
      type: String,
      enum: ['fixed-price','hourly'],
      default: 'fixed-price'
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  applicationDeadline: { type: Date, required: true },
  deliverables: { type: [String], default: [] },
  features: { type: [String], default: [] },
  techStack: { type: [String], default: [] },
  clientMaterials: { type: [String], default: [] },
  estimatedDurationInDays: { type: Number },
  milestones: {
    type: [{ description: String, percentage: Number }],
    default: []
  },
  status: { type: String, enum: ['open','in-progress','completed','cancelled'], default: 'open' },
  proposals: [{ type: Schema.Types.ObjectId, ref: 'Proposal' }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
