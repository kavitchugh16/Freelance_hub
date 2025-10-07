// // server/models/Project.js
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const projectSchema = new Schema({
//   title: { type: String, required: true, trim: true, maxlength: 150 },
//   description: { type: String, required: true, maxlength: 5000 },
//   category: {
//     type: String,
//     required: true,
//     enum: ['Web Development','Mobile Development','Graphic Design','Content Writing','Digital Marketing','Other'],
//     default: 'Other'
//   },
//   clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   requiredSkills: { type: [String], required: true },
//   experienceLevel: { type: String, enum: ['Entry-Level','Intermediate','Expert'], required: true },
//   budget: {
//     type: {
//       type: String,
//       enum: ['fixed-price','hourly'],
//       default: 'fixed-price'
//     },
//     amount: { type: Number, required: true },
//     currency: { type: String, default: 'USD' }
//   },
//   applicationDeadline: { type: Date, required: true },
//   deliverables: { type: [String], default: [] },
//   features: { type: [String], default: [] },
//   techStack: { type: [String], default: [] },
//   clientMaterials: { type: [String], default: [] },
//   estimatedDurationInDays: { type: Number },
//   milestones: {
//     type: [{ description: String, percentage: Number }],
//     default: []
//   },
//   status: { type: String, enum: ['open','in-progress','completed','cancelled'], default: 'open' },
//   proposals: [{ type: Schema.Types.ObjectId, ref: 'Proposal' }]
// }, { timestamps: true });

// module.exports = mongoose.model('Project', projectSchema);
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
  
  // --- MODIFIED BUDGET SECTION START ---
// In server/models/Project.js

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
        // The validator function now correctly accesses this.budget.minimum
        validator: function(value) {
          return value > this.budget.minimum;
        },
        message: 'Maximum budget must be greater than the minimum budget.'
      }
    },
    currency: { type: String, default: 'INR' }
  },
  // --- END CORRECTED SECTION ---
  // --- MODIFIED BUDGET SECTION END ---

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