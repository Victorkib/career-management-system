const batch2Careers = [
  {
    title: 'Civil Engineer',
    category: 'Engineering',
    tier: 'PREMIUM',
    performanceLevel: 'GOOD',
    academicRequirementScore: 9, // B- grade = 9 points
    description:
      'Design, develop, and supervise infrastructure projects such as roads, buildings, airports, tunnels, dams, bridges, and water supply systems while ensuring safety and sustainability.',
    keySubjects: [
      'Mathematics',
      'Physics',
      'Structural Analysis',
      'Materials Science',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Construction Companies',
      'Government Agencies',
      'Engineering Consultancies',
      'Urban Planning Firms',
      'Research Institutions',
    ],
    salary: {
      entry: '35000',
      mid: '65000',
      senior: '110000',
    },
    institutions: [], // Will be populated later
    programDuration: '4-5 years',
    skillsRequired: [
      'AutoCAD',
      'Structural Analysis',
      'Project Management',
      'Technical Drawing',
      'Building Codes',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Civil Engineer', 'Site Engineer'],
        experience: '0-3 years',
        description:
          'Assist with designs, conduct site inspections, and prepare technical documentation.',
      },
      midLevel: {
        roles: ['Civil Engineer', 'Project Engineer'],
        experience: '4-8 years',
        description:
          'Lead design projects, manage construction activities, and ensure compliance with regulations.',
      },
      seniorLevel: {
        roles: ['Senior Civil Engineer', 'Project Manager'],
        experience: '8-15 years',
        description:
          'Oversee multiple projects, develop engineering standards, and mentor junior engineers.',
      },
      executiveLevel: {
        roles: ['Engineering Director', 'Chief Engineer'],
        experience: '15+ years',
        description:
          'Set engineering strategy, lead large-scale projects, and manage engineering departments.',
      },
    },
    certifications: [
      {
        name: 'Professional Engineer (PE)',
        provider: 'State Licensing Board',
        description:
          'Required license to offer services directly to the public.',
      },
      {
        name: 'Leadership in Energy and Environmental Design (LEED)',
        provider: 'U.S. Green Building Council',
        description:
          'Validates expertise in sustainable building design and construction.',
      },
    ],
    industryTrends: [
      'Sustainable Infrastructure',
      'Smart Cities',
      'Building Information Modeling (BIM)',
      'Resilient Design',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Mechanical Engineer',
    category: 'Engineering',
    tier: 'PREMIUM',
    performanceLevel: 'GOOD',
    academicRequirementScore: 9, // B- grade = 9 points
    description:
      'Design, develop, build, and test mechanical devices, including tools, engines, and machines, applying principles of motion, energy, and force to solve problems.',
    keySubjects: [
      'Mathematics',
      'Physics',
      'Thermodynamics',
      'Materials Science',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Manufacturing Companies',
      'Automotive Industry',
      'Aerospace',
      'Energy Sector',
      'Research and Development',
    ],
    salary: {
      entry: '40000',
      mid: '70000',
      senior: '120000',
    },
    institutions: [], // Will be populated later
    programDuration: '4 years',
    skillsRequired: [
      'CAD Software',
      'Finite Element Analysis',
      'Thermodynamics',
      'Fluid Mechanics',
      'Manufacturing Processes',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Mechanical Engineer', 'Design Engineer'],
        experience: '0-3 years',
        description:
          'Create technical drawings, assist with product development, and conduct testing.',
      },
      midLevel: {
        roles: ['Mechanical Engineer', 'Product Development Engineer'],
        experience: '4-8 years',
        description:
          'Lead design projects, develop new products, and optimize manufacturing processes.',
      },
      seniorLevel: {
        roles: ['Senior Mechanical Engineer', 'Engineering Manager'],
        experience: '8-15 years',
        description:
          'Oversee engineering teams, develop technical strategies, and lead complex projects.',
      },
      executiveLevel: {
        roles: ['Director of Engineering', 'Chief Mechanical Engineer'],
        experience: '15+ years',
        description:
          'Set engineering direction, manage multiple departments, and drive innovation initiatives.',
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
        name: 'Certified Manufacturing Engineer (CMfgE)',
        provider: 'Society of Manufacturing Engineers',
        description:
          'Validates expertise in manufacturing processes and technologies.',
      },
    ],
    industryTrends: [
      'Additive Manufacturing',
      'Robotics',
      'Sustainable Design',
      'Digital Twins',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Electrical Engineer',
    category: 'Engineering',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10, // B grade = 10 points
    description:
      'Design, develop, test, and supervise the manufacturing of electrical equipment, systems, and components, from small microchips to large power station generators.',
    keySubjects: ['Mathematics', 'Physics', 'Circuit Theory', 'Electronics'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'High',
    jobProspects: [
      'Power Companies',
      'Electronics Manufacturers',
      'Telecommunications',
      'Automotive Industry',
      'Aerospace',
    ],
    salary: {
      entry: '45000',
      mid: '75000',
      senior: '125000',
    },
    institutions: [], // Will be populated later
    programDuration: '4 years',
    skillsRequired: [
      'Circuit Design',
      'Power Systems',
      'Electronics',
      'Programming',
      'Signal Processing',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Electrical Engineer', 'Electronics Engineer'],
        experience: '0-3 years',
        description:
          'Design and test circuits, assist with product development, and troubleshoot electrical systems.',
      },
      midLevel: {
        roles: ['Electrical Engineer', 'Power Systems Engineer'],
        experience: '4-8 years',
        description:
          'Lead design projects, develop electrical systems, and implement technical solutions.',
      },
      seniorLevel: {
        roles: ['Senior Electrical Engineer', 'Lead Engineer'],
        experience: '8-15 years',
        description:
          'Oversee engineering teams, develop technical standards, and lead complex projects.',
      },
      executiveLevel: {
        roles: ['Engineering Director', 'Chief Electrical Engineer'],
        experience: '15+ years',
        description:
          'Set engineering strategy, manage departments, and drive technological innovation.',
      },
    },
  },
];

export default batch2Careers;
