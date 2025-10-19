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
  
  // ✅ --- THIS IS THE FIX ---
  // Renamed 'freelancerId' to 'freelancer' to match your controller logic
  freelancer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    default: null, 
    index: true 
  },
  // ✅ --- END OF FIX ---

  requiredSkills: { type: [String], required: true },
  experienceLevel: { type: String, enum: ['Entry-Level','Intermediate','Expert'], required: true },
  
  // --- CORRECTED BUDGET SECTION ---
  budget: {
    type: {
      type: String,
      enum: ['fixed-price-range'],
      default: 'fixed-price-range'
    },
    minimum: {
      type: Number,
      required: [true, 'A minimum budget is required.']
    },
    maximum: {
      type: Number,
      required: [true, 'A maximum budget is required.'],
      validate: {
        validator: function(value) {
          // The validator function now correctly accesses this.budget.minimum
          return value > this.budget.minimum;
        },
        message: 'Maximum budget must be greater than the minimum budget.'
      }
    },
    currency: { type: String, default: 'INR' }
  },
  // --- END CORRECTED SECTION ---

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