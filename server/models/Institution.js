import mongoose from 'mongoose';
import slugify from 'slugify';

const InstitutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an institution name'],
      trim: true,
      unique: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    slug: String,
    type: {
      type: String,
      required: [true, 'Please provide an institution type'],
      enum: [
        'University',
        'College',
        'Technical Institute',
        'Technical College', // Added for technical training institutions
        'Vocational Center',
        'Vocational Institute', // Added for specialized vocational training
        'Business College', // Added for business-focused institutions
        'Security Training Institute', // Added for security training
        'Hospitality College', // Added for hospitality training
        'Driving School', // Added for driving instruction
        'Agricultural College', // Added for agricultural training
        'Community College', // Added for community-based training
        'Other',
      ],
    },
    location: {
      address: String,
      city: {
        type: String,
        required: [true, 'Please provide a city'],
      },
      county: String,
      country: {
        type: String,
        default: 'Kenya',
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        'Please provide a valid URL with HTTP or HTTPS',
      ],
    },
    contact: {
      email: String,
      phone: String,
      socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
      },
    },
    programs: [
      {
        name: String,
        level: {
          type: String,
          enum: [
            'Certificate',
            'Diploma',
            'Bachelors',
            'Masters',
            'Doctorate',
            'Short Course', // Added for brief training programs
            'Other',
          ],
        },
        duration: String,
        description: String,
        careers: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Career',
          },
        ],
        entryRequirements: {
          minimumGrade: String,
          specificSubjects: [
            {
              subject: String,
              grade: String,
            },
          ],
          additionalRequirements: [String],
        },
        tuitionFees: String,
      },
    ],
    rankings: {
      national: Number,
      international: Number,
      year: Number,
    },
    facilities: [String],
    accreditation: [String],
    establishedYear: Number,
    logo: String,
    images: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create institution slug from the name
InstitutionSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Update the updatedAt field on save
InstitutionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Institution = mongoose.model('Institution', InstitutionSchema);

export default Institution;
