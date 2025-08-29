// BATCH 9 - FINAL BATCH: Foundation Level Careers
// These careers have the lowest academic requirements but are essential for society

const finalBatchCareers = [
  {
    title: 'Street Vendor',
    category: 'Business',
    description:
      'Sell goods and services on the street or in informal markets, managing small-scale trading operations and contributing to local commerce.',
    keySubjects: ['Mathematics', 'English'],
    requiredGrades: {},
    minimumMeanGrade: 'D-',
    tier: 'FOUNDATION',
    performanceLevel: 'BASIC',
    academicRequirementScore: 2, // D- grade = 2 points
    marketDemand: 'Very High',
    jobProspects: [
      'Informal Markets',
      'Street Trading',
      'Mobile Vendors',
      'Market Stalls',
      'Self Employment',
    ],
    salary: {
      entry: '8000',
      mid: '18000',
      senior: '35000',
    },
    institutions: [], // Will be populated later
    programDuration: '3 weeks - 3 months',
    skillsRequired: [
      'Sales Skills',
      'Customer Relations',
      'Money Management',
      'Product Knowledge',
      'Persistence',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Street Vendor', 'Mobile Trader'],
        experience: '0-2 years',
        description:
          'Start small trading operations, learn customer service, manage daily sales and inventory.',
      },
      midLevel: {
        roles: ['Market Stall Owner', 'Small Shop Owner'],
        experience: '3-7 years',
        description:
          'Establish permanent trading locations, expand product range, build customer base.',
      },
      seniorLevel: {
        roles: ['Market Coordinator', 'Wholesale Trader'],
        experience: '8-15 years',
        description:
          'Coordinate market activities, engage in wholesale trading, mentor new vendors.',
      },
      executiveLevel: {
        roles: ['Market Manager', 'Trading Business Owner'],
        experience: '15+ years',
        description:
          'Manage entire markets, own multiple trading businesses, develop trading networks.',
      },
    },
    certifications: [
      {
        name: 'Business Permit',
        provider: 'County Government',
        description:
          'Legal permit for street trading and informal business operations.',
      },
      {
        name: 'Basic Business Skills Certificate',
        provider: 'Kenya Institute of Business Studies',
        description:
          'Training in basic entrepreneurship and business management.',
      },
    ],
    industryTrends: [
      'Mobile Money Integration',
      'Digital Marketing',
      'Product Diversification',
      'Cooperative Formation',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  {
    title: 'Waste Management Worker',
    category: 'Cleaning & Maintenance',
    description:
      'Collect, sort, and manage waste materials while promoting environmental conservation, recycling, and sustainable waste disposal practices.',
    keySubjects: ['English', 'Geography'],
    requiredGrades: {},
    minimumMeanGrade: 'D-',
    tier: 'FOUNDATION',
    performanceLevel: 'BASIC',
    academicRequirementScore: 2, // D- grade = 2 points
    marketDemand: 'High',
    jobProspects: [
      'Waste Management Companies',
      'County Councils',
      'Recycling Centers',
      'Environmental NGOs',
      'Self Employment',
    ],
    salary: {
      entry: '12000',
      mid: '22000',
      senior: '40000',
    },
    institutions: [], // Will be populated later
    programDuration: '2-6 months',
    skillsRequired: [
      'Environmental Awareness',
      'Physical Stamina',
      'Safety Consciousness',
      'Teamwork',
      'Reliability',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Waste Collector', 'Sorter'],
        experience: '0-2 years',
        description:
          'Collect and sort waste materials, follow safety protocols, maintain equipment.',
      },
      midLevel: {
        roles: ['Team Leader', 'Recycling Coordinator'],
        experience: '3-7 years',
        description:
          'Lead waste collection teams, coordinate recycling programs, train new workers.',
      },
      seniorLevel: {
        roles: ['Waste Management Supervisor', 'Environmental Officer'],
        experience: '8-15 years',
        description:
          'Supervise waste management operations, develop environmental programs, ensure compliance.',
      },
      executiveLevel: {
        roles: ['Waste Management Manager', 'Environmental Consultant'],
        experience: '15+ years',
        description:
          'Manage waste management facilities, provide environmental consulting, develop sustainability policies.',
      },
    },
    certifications: [
      {
        name: 'Waste Management Certificate',
        provider: 'NEMA (National Environment Management Authority)',
        description:
          'Environmental waste handling and management certification.',
      },
      {
        name: 'Occupational Safety Certificate',
        provider: 'Directorate of Occupational Safety and Health Services',
        description: 'Safety training for waste management workers.',
      },
    ],
    industryTrends: [
      'Waste-to-Energy Technology',
      'Circular Economy',
      'Smart Waste Management',
      'Community-Based Recycling',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
];

export default finalBatchCareers;
