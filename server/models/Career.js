import mongoose from 'mongoose';
import slugify from 'slugify';

const CareerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a career title'],
      trim: true,
      unique: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: String,
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Technology',
        'Engineering',
        'Healthcare',
        'Business',
        'Finance',
        'Education & Training',
        'Education',
        'Arts',
        'Science',
        'Legal',
        'Social Sciences',
        'Agriculture',
        'Hospitality',
        'Hospitality & Food Service',
        'Media',
        'Construction',
        'Manufacturing',
        'Transportation',
        'Automotive',
        'Beauty & Personal Care',
        'Security & Safety',
        'Fashion & Textiles',
        'Cleaning & Maintenance',
        'Technical & Vocational',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [50, 'Description must be at least 50 characters'],
    },
    keySubjects: {
      type: [String],
      required: [true, 'Please provide key subjects'],
    },
    requiredGrades: {
      type: Map,
      of: String,
      default: {},
    },
    minimumMeanGrade: {
      type: String,
      enum: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'],
      required: [true, 'Please provide a minimum mean grade'],
    },
    marketDemand: {
      type: String,
      enum: ['Very High', 'High', 'Medium', 'Low', 'Moderate'],
      required: [true, 'Please provide market demand'],
    },
    jobProspects: {
      type: [String],
      required: [true, 'Please provide job prospects'],
    },
    salary: {
      entry: {
        type: String,
        required: [true, 'Please provide entry level salary'],
      },
      mid: {
        type: String,
        required: [true, 'Please provide mid-career salary'],
      },
      senior: {
        type: String,
        required: [true, 'Please provide senior level salary'],
      },
    },
    institutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
      },
    ],
    programDuration: {
      type: String,
      required: [true, 'Please provide program duration'],
    },
    skillsRequired: [String],
    careerPath: {
      entryLevel: {
        roles: [String],
        experience: String,
        description: String,
      },
      midLevel: {
        roles: [String],
        experience: String,
        description: String,
      },
      seniorLevel: {
        roles: [String],
        experience: String,
        description: String,
      },
      executiveLevel: {
        roles: [String],
        experience: String,
        description: String,
      },
    },
    certifications: [
      {
        name: String,
        provider: String,
        description: String,
      },
    ],
    industryTrends: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    saves: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    // Explicitly add the image field
    image: {
      type: String,
      default: '', // Default to empty string if no image is provided
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create career slug from the title
CareerSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Update the updatedAt field on save
CareerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for related careers (to be populated as needed)
CareerSchema.virtual('relatedCareers', {
  ref: 'Career',
  localField: 'category',
  foreignField: 'category',
  justOne: false,
  options: { limit: 5 },
});

const Career = mongoose.model('Career', CareerSchema);

export default Career;
