// Batch 7: Additional Engineering and Business Careers
const batch7Careers = [
  {
    title: 'Aerospace Engineer',
    category: 'Engineering',
    description:
      'Design, develop, and test aircraft, spacecraft, satellites, and missiles, applying principles of aerodynamics, propulsion, and materials science to create cutting-edge aerospace technology.',
    keySubjects: [
      'Mathematics',
      'Physics',
      'Aerodynamics',
      'Propulsion Systems',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 11, // A- = 11 points
    marketDemand: 'Medium',
    jobProspects: [
      'Aerospace Companies',
      'Defense Contractors',
      'Space Agencies',
      'Airlines',
      'Research Institutions',
    ],
    salary: { entry: '60000', mid: '95000', senior: '150000' },
    institutions: [],
    programDuration: '4-5 years',
    skillsRequired: [
      'CAD/CAM Software',
      'Fluid Dynamics',
      'Structural Analysis',
      'Propulsion Systems',
      'Materials Science',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Aerospace Engineer', 'Design Engineer'],
        experience: '0-3 years',
        description:
          'Assist with aircraft or spacecraft design, conduct testing, and analyze performance data.',
      },
      midLevel: {
        roles: ['Aerospace Engineer', 'Propulsion Engineer'],
        experience: '4-8 years',
        description:
          'Lead design projects, develop aerospace systems, and solve complex engineering problems.',
      },
      seniorLevel: {
        roles: ['Senior Aerospace Engineer', 'Technical Lead'],
        experience: '8-15 years',
        description:
          'Oversee engineering teams, develop technical standards, and lead major aerospace projects.',
      },
      executiveLevel: {
        roles: ['Chief Engineer', 'Director of Aerospace Engineering'],
        experience: '15+ years',
        description:
          'Set engineering strategy, manage multiple departments, and drive aerospace innovation.',
      },
    },
    certifications: [
      {
        name: 'Professional Engineer (PE)',
        provider: 'State Licensing Board',
        description:
          'Required license for engineers who offer services directly to the public.',
      },
      {
        name: 'Certified Systems Engineering Professional (CSEP)',
        provider: 'International Council on Systems Engineering',
        description:
          'Validates expertise in systems engineering principles and practices.',
      },
    ],
    industryTrends: [
      'Commercial Space Travel',
      'Unmanned Aerial Vehicles',
      'Sustainable Aviation',
      'Hypersonic Technology',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },

  {
    title: 'Chemical Engineer',
    category: 'Engineering',
    description:
      'Apply principles of chemistry, biology, physics, and mathematics to design and develop processes for manufacturing chemicals, fuels, drugs, food, and many other products.',
    keySubjects: ['Chemistry', 'Mathematics', 'Physics', 'Biology'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10, // B = 10 points
    marketDemand: 'Medium',
    jobProspects: [
      'Chemical Manufacturing',
      'Pharmaceutical Companies',
      'Food Processing',
      'Energy Sector',
      'Environmental Firms',
    ],
    salary: { entry: '50000', mid: '80000', senior: '130000' },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Process Design',
      'Thermodynamics',
      'Reaction Kinetics',
      'Fluid Dynamics',
      'Process Control',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Chemical Engineer', 'Process Engineer'],
        experience: '0-3 years',
        description:
          'Monitor production processes, troubleshoot equipment issues, and assist with process improvements.',
      },
      midLevel: {
        roles: ['Chemical Engineer', 'Production Engineer'],
        experience: '4-8 years',
        description:
          'Design chemical processes, optimize production efficiency, and lead improvement projects.',
      },
      seniorLevel: {
        roles: ['Senior Chemical Engineer', 'Process Design Manager'],
        experience: '8-15 years',
        description:
          'Oversee engineering teams, develop technical standards, and lead major facility projects.',
      },
      executiveLevel: {
        roles: ['Engineering Director', 'Chief Process Engineer'],
        experience: '15+ years',
        description:
          'Set engineering strategy, manage multiple departments, and drive innovation initiatives.',
      },
    },
    certifications: [
      {
        name: 'Professional Engineer (PE)',
        provider: 'State Licensing Board',
        description:
          'Required license for engineers who offer services directly to the public.',
      },
      {
        name: 'Certified Process Safety Professional (CCPSC)',
        provider: 'Board of Certified Safety Professionals',
        description: 'Validates expertise in process safety management.',
      },
    ],
    industryTrends: [
      'Green Chemistry',
      'Biofuels',
      'Nanotechnology',
      'Sustainable Manufacturing',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  {
    title: 'Entrepreneur',
    category: 'Business',
    description:
      'Create and run new businesses, taking on financial risks in the hope of profit, identifying market opportunities, securing resources, and building organizations from the ground up.',
    keySubjects: ['Business', 'Economics', 'Marketing', 'Finance'],
    requiredGrades: {},
    minimumMeanGrade: 'C',
    tier: 'STANDARD',
    performanceLevel: 'AVERAGE',
    academicRequirementScore: 6, // C = 6 points
    marketDemand: 'Medium',
    jobProspects: [
      'Startups',
      'Small Businesses',
      'Franchises',
      'Social Enterprises',
      'Tech Companies',
    ],
    salary: { entry: 'Variable', mid: 'Variable', senior: 'Variable' },
    institutions: [],
    programDuration: 'Variable',
    skillsRequired: [
      'Business Planning',
      'Financial Management',
      'Leadership',
      'Problem Solving',
      'Resilience',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Founder', 'Small Business Owner'],
        experience: '0-3 years',
        description:
          'Launch and operate a small business, handling multiple functions from operations to sales.',
      },
      midLevel: {
        roles: ['Established Entrepreneur', 'CEO of Growing Business'],
        experience: '4-7 years',
        description:
          'Scale business operations, build teams, and secure additional funding or resources.',
      },
      seniorLevel: {
        roles: ['Serial Entrepreneur', 'Business Leader'],
        experience: '8-15 years',
        description:
          'Launch multiple successful ventures, mentor other entrepreneurs, and possibly invest in startups.',
      },
      executiveLevel: {
        roles: ['Angel Investor', 'Venture Capitalist'],
        experience: '15+ years',
        description:
          'Fund and advise multiple businesses, serve on boards, and shape entrepreneurial ecosystems.',
      },
    },
    certifications: [
      {
        name: 'Certified Entrepreneur',
        provider: 'Entrepreneurship and Small Business Certification',
        description:
          'Validates knowledge of entrepreneurship principles and small business management.',
      },
    ],
    industryTrends: [
      'Lean Startup Methodology',
      'Social Entrepreneurship',
      'Digital Business Models',
      'Crowdfunding',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },

  {
    title: 'Supply Chain Manager',
    category: 'Business',
    description:
      'Oversee and coordinate all activities involved in sourcing, procurement, conversion, and logistics management, ensuring efficient flow of goods, services, and information from point of origin to consumption.',
    keySubjects: [
      'Business',
      'Logistics',
      'Operations Management',
      'Statistics',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    tier: 'PREMIUM',
    performanceLevel: 'GOOD',
    academicRequirementScore: 9, // B- = 9 points
    marketDemand: 'High',
    jobProspects: [
      'Manufacturing Companies',
      'Retail Corporations',
      'Logistics Providers',
      'E-commerce',
      'Consulting Firms',
    ],
    salary: { entry: '45000', mid: '75000', senior: '120000' },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Logistics Management',
      'Inventory Control',
      'Procurement',
      'Supplier Management',
      'Analytics',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Supply Chain Analyst', 'Logistics Coordinator'],
        experience: '0-3 years',
        description:
          'Analyze supply chain data, coordinate shipments, and support procurement activities.',
      },
      midLevel: {
        roles: ['Supply Chain Manager', 'Procurement Manager'],
        experience: '4-8 years',
        description:
          'Manage supply chain operations, develop supplier relationships, and implement process improvements.',
      },
      seniorLevel: {
        roles: ['Senior Supply Chain Manager', 'Director of Operations'],
        experience: '8-15 years',
        description:
          'Set supply chain strategy, manage global operations, and lead continuous improvement initiatives.',
      },
      executiveLevel: {
        roles: ['Chief Supply Chain Officer', 'VP of Operations'],
        experience: '15+ years',
        description:
          'Define supply chain vision, lead operations organization, and drive operational excellence.',
      },
    },
    certifications: [
      {
        name: 'Certified Supply Chain Professional (CSCP)',
        provider: 'Association for Supply Chain Management',
        description:
          'Validates expertise in supply chain management principles and practices.',
      },
      {
        name: 'Certified Professional in Supply Management (CPSM)',
        provider: 'Institute for Supply Management',
        description:
          'Certifies knowledge of procurement and supply management.',
      },
    ],
    industryTrends: [
      'Supply Chain Digitization',
      'Sustainable Supply Chains',
      'Blockchain in Logistics',
      'Predictive Analytics',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
];

export default batch7Careers;
