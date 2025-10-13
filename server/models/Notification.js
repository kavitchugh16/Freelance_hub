// // server/models/Notification.js
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const notificationSchema = new Schema({
//     // User who receives the notification (the Client)
//     recipientId: { 
//         type: Schema.Types.ObjectId, 
//         ref: 'User', 
//         required: true 
//     },
//     // Reference to the Proposal that triggered the notification
//     proposalId: { 
//         type: Schema.Types.ObjectId, 
//         ref: 'Proposal' 
//     },
//     // Reference to the Project
//     projectId: { 
//         type: Schema.Types.ObjectId, 
//         ref: 'Project', 
//         required: true 
//     },
//     // Custom message
//     message: { 
//         type: String, 
//         required: true 
//     },
//     // Notification type (e.g., bid, accepted, message)
//     type: { 
//         type: String, 
//         enum: ['new_bid', 'proposal_accepted', 'project_update'], 
//         required: true 
//     },
//     isRead: { 
//         type: Boolean, 
//         default: false 
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('Notification', notificationSchema);
// server/models/Notification.js
// server/models/Notification.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    // User who receives the notification
    recipientId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Reference to the Proposal that triggered the notification
    proposalId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Proposal' 
    },
    // Reference to the Project
    projectId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    // Custom message
    message: { 
        type: String, 
        required: true 
    },
    // Notification type
    type: { 
        type: String, 
        // --- ✅ FIX: Updated the enum list to include all notification types used by the app ---
        enum: ['new_bid', 'outbid', 'bid_accepted'], 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);