// Batch 6: Technical & Vocational Careers - Final Batch
const batch6Careers = [
  {
    title: 'Motor Vehicle Mechanic',
    category: 'Technical & Vocational',
    tier: 'FOUNDATION',
    performanceLevel: 'BASIC',
    academicRequirementScore: 2, // D+ grade = 2 points
    description:
      'Diagnose, repair, and maintain motor vehicles including cars, trucks, and motorcycles. Work with engines, transmissions, brakes, and electrical systems.',
    keySubjects: ['Mathematics', 'Physics', 'Chemistry'],
    requiredGrades: new Map([
      ['Mathematics', 'D+'],
      ['Physics', 'D+'],
      ['Chemistry', 'D'],
    ]),
    minimumMeanGrade: 'D+',
    salary: {
      entry: 'KSh 25,000 - 40,000',
      mid: 'KSh 40,000 - 65,000',
      senior: 'KSh 65,000 - 90,000',
    },
    marketDemand: 'High',
    jobProspects: [
      'Apprentice Mechanic',
      'Qualified Mechanic',
      'Senior Mechanic',
      'Workshop Supervisor',
      'Workshop Manager',
    ],
    programDuration: '2-3 years',
    skillsRequired: [
      'Problem-solving',
      'Manual dexterity',
      'Technical knowledge',
      'Customer service',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Apprentice Mechanic', 'Trainee Mechanic'],
        experience: '0-2 years',
        description: 'Basic vehicle maintenance and assist senior mechanics',
      },
      midLevel: {
        roles: ['Qualified Mechanic', 'Automotive Technician'],
        experience: '2-5 years',
        description:
          'Engine diagnostics, brake repairs, and customer consultation',
      },
      seniorLevel: {
        roles: ['Senior Mechanic', 'Lead Technician'],
        experience: '5-10 years',
        description:
          'Complex repairs, training apprentices, and quality control',
      },
      executiveLevel: {
        roles: ['Workshop Manager', 'Service Manager'],
        experience: '10+ years',
        description:
          'Workshop management, business operations, and staff supervision',
      },
    },
    certifications: [
      {
        name: 'Motor Vehicle Mechanic Certificate',
        provider: 'NITA',
        description:
          'Basic certification for motor vehicle repair and maintenance',
      },
      {
        name: 'Automotive Technology Diploma',
        provider: 'Technical Institutes',
        description: 'Advanced training in modern automotive systems',
      },
    ],
    industryTrends: [
      'Electric vehicle technology',
      'Computer diagnostics',
      'Hybrid systems',
      'Advanced materials',
    ],
  },
  {
    title: 'Farm Worker & Agricultural Assistant',
    category: 'Agriculture',
    tier: 'FOUNDATION',
    performanceLevel: 'BASIC',
    academicRequirementScore: 1,
    description:
      'Assist in various farming activities including crop cultivation, livestock care, and farm maintenance. Support agricultural operations and food production.',
    keySubjects: ['Agriculture', 'Biology', 'Geography'],
    requiredGrades: new Map([
      ['Agriculture', 'D'],
      ['Biology', 'D'],
      ['Geography', 'D'],
    ]),
    minimumMeanGrade: 'D',
    salary: {
      entry: 'KSh 15,000 - 25,000',
      mid: 'KSh 25,000 - 40,000',
      senior: 'KSh 40,000 - 60,000',
    },
    marketDemand: 'High',
    jobProspects: [
      'Farm Laborer',
      'Agricultural Assistant',
      'Farm Supervisor',
      'Agricultural Coordinator',
      'Farm Manager',
    ],
    programDuration: '6 months - 2 years',
    skillsRequired: [
      'Physical stamina',
      'Basic farming knowledge',
      'Equipment handling',
      'Teamwork',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Farm Laborer', 'Agricultural Worker'],
        experience: '0-1 years',
        description:
          'Crop planting, weeding, harvesting, and basic animal care',
      },
      midLevel: {
        roles: ['Agricultural Assistant', 'Farm Hand'],
        experience: '1-3 years',
        description:
          'Equipment operation, crop monitoring, and livestock management',
      },
      seniorLevel: {
        roles: ['Farm Supervisor', 'Agricultural Coordinator'],
        experience: '3-7 years',
        description:
          'Team supervision, production planning, and quality control',
      },
      executiveLevel: {
        roles: ['Farm Manager', 'Agricultural Manager'],
        experience: '7+ years',
        description:
          'Farm operations, budget management, and strategic planning',
      },
    },
    certifications: [
      {
        name: 'Agricultural Skills Certificate',
        provider: 'Ministry of Agriculture',
        description:
          'Basic certification in agricultural practices and techniques',
      },
      {
        name: 'Crop Production Certificate',
        provider: 'Agricultural Training Institutes',
        description: 'Specialized training in crop cultivation and management',
      },
    ],
    industryTrends: [
      'Sustainable farming',
      'Organic agriculture',
      'Precision farming',
      'Climate-smart agriculture',
    ],
  },
];

export default batch6Careers;
