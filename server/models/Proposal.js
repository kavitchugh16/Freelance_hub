// server/models/Proposal.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const proposalSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true, trim: true, maxlength: 3000 },
  bid: {
    type: {
      type: String,
      enum: ['fixed-price','hourly'],
      required: true    
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  estimatedCompletionDate: { type: Date, required: true },
  proposedApproach: { type: String, maxlength: 2000 },
  relevantPortfolioItems: { type: [String], default: [] },
  clarifyingQuestions: { type: [String], default: [] },
  status: { type: String, enum: ['submitted','viewed','shortlisted','accepted','declined','withdrawn'], default: 'submitted' }
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
