import mongoose from 'mongoose';

const RecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    kcseResults: {
      year: Number,
      meanGrade: String,
      meanPoints: Number,
      subjects: [
        {
          subject: String,
          grade: String,
          points: Number,
        },
      ],
    },
    strengths: [String],
    performanceLevel: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'BASIC', 'BELOW_AVERAGE'],
    },
    eligibleTiers: {
      type: [String],
      enum: ['ELITE', 'PREMIUM', 'STANDARD', 'FOUNDATION'],
      default: [],
    },
    performanceInsights: {
      message: String,
      motivationalQuote: String,
      nextSteps: [String],
      improvementAreas: [String],
    },
    recommendations: [
      {
        career: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Career',
        },
        match: {
          type: Number,
          min: 0,
          max: 100,
        },
        reasons: [String],
        saved: {
          type: Boolean,
          default: false,
        },
        // Add ML enhancement fields
        mlEnhanced: {
          type: Boolean,
          default: false,
        },
        mlScore: {
          type: Number,
          min: 0,
          max: 100,
        },
        successProbability: {
          type: Number,
          min: 0,
          max: 1,
        },
        mlConfidence: {
          type: Number,
          min: 0,
          max: 100,
        },
        improvementSuggestions: {
          type: [String],
          default: [],
        },
        tier: {
          type: String,
          enum: ['ELITE', 'PREMIUM', 'STANDARD', 'FOUNDATION'],
        },
        performanceMatch: {
          type: Boolean,
          default: true,
        },
        academicFit: {
          type: Number,
          min: 0,
          max: 100,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field on save
RecommendationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Recommendation = mongoose.model('Recommendation', RecommendationSchema);

export default Recommendation;
