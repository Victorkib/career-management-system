import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: [true, 'Please provide an action'],
      enum: [
        'login',
        'register',
        'api_request',
        'update_profile',
        'input_results',
        'view_career',
        'save_career',
        'remove_saved_career',
        'view_institution',
        'update_preferences',
        'generate_recommendations',
        'ml_enhanced_recommendations',
        'update_recommendations',
        'password_reset',
        'email_verification',
        'admin_action',
        'admin_invitation_sent',
        'admin_invitation_accepted',
        'performance_aware_recommendations',
        'update_performance_aware_recommendations',
      ],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: String,
    userAgent: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user and date
ActivitySchema.index({ user: 1, createdAt: -1 });

const Activity = mongoose.model('Activity', ActivitySchema);

export default Activity;
