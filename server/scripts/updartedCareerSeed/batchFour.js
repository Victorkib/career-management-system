// Batch 4: Business and Finance Careers (Comprehensive)
const batch4Careers = [
  {
    title: 'Marketing Manager',
    category: 'Business',
    tier: 'PREMIUM',
    performanceLevel: 'GOOD',
    academicRequirementScore: 7,
    description:
      'Marketing managers develop and implement marketing strategies to promote products, services, or brands. They analyze market trends, consumer behavior, and competitive landscapes to create effective campaigns that drive business growth and customer engagement.',
    keySubjects: ['Business Studies', 'Economics', 'English', 'Mathematics'],
    requiredGrades: new Map([
      ['Business Studies', 'C+'],
      ['Economics', 'C+'],
      ['English', 'C+'],
      ['Mathematics', 'C+'],
    ]),
    minimumMeanGrade: 'C+',
    salary: {
      entry: 'KSh 35,000 - 55,000',
      mid: 'KSh 55,000 - 85,000',
      senior: 'KSh 85,000 - 150,000',
    },
    marketDemand: 'High',
    jobProspects: [
      'Marketing Specialist',
      'Brand Manager',
      'Digital Marketing Manager',
      'Product Marketing Manager',
      'Marketing Director',
    ],
    programDuration: '4 years',
    skillsRequired: [
      'Strategic thinking',
      'Data analysis',
      'Creative problem-solving',
      'Communication',
      'Digital marketing',
      'Brand management',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Marketing Assistant', 'Marketing Coordinator'],
        experience: '0-2 years',
        description: 'Support marketing campaigns and conduct market research',
      },
      midLevel: {
        roles: ['Marketing Specialist', 'Brand Executive'],
        experience: '2-5 years',
        description:
          'Develop marketing strategies and manage digital campaigns',
      },
      seniorLevel: {
        roles: ['Marketing Manager', 'Brand Manager'],
        experience: '5-10 years',
        description: 'Lead marketing teams and develop brand strategies',
      },
      executiveLevel: {
        roles: ['Chief Marketing Officer', 'Marketing Director'],
        experience: '10+ years',
        description: 'Set marketing vision and drive business growth',
      },
    },
    certifications: [
      {
        name: 'Google Ads Certification',
        provider: 'Google',
        description:
          'Demonstrates proficiency in Google Ads and online advertising',
      },
      {
        name: 'HubSpot Content Marketing Certification',
        provider: 'HubSpot',
        description:
          'Validates skills in content marketing strategy and execution',
      },
      {
        name: 'Facebook Blueprint Certification',
        provider: 'Meta',
        description:
          'Certifies expertise in Facebook and Instagram advertising',
      },
    ],
    industryTrends: [
      'Digital transformation',
      'Personalization',
      'AI-driven marketing',
      'Influencer marketing',
      'Sustainability marketing',
    ],
  },
  {
    title: 'Human Resources Manager',
    category: 'Business',
    tier: 'PREMIUM',
    performanceLevel: 'GOOD',
    academicRequirementScore: 7,
    description:
      'HR managers oversee all aspects of human resources practices and processes. They develop policies, manage recruitment, handle employee relations, ensure compliance with labor laws, and create strategies to attract, develop, and retain talent.',
    keySubjects: ['Business Studies', 'English', 'Psychology', 'Mathematics'],
    requiredGrades: new Map([
      ['Business Studies', 'C+'],
      ['English', 'B-'],
      ['Psychology', 'C+'],
      ['Mathematics', 'C+'],
    ]),
    minimumMeanGrade: 'C+',
    salary: {
      entry: 'KSh 40,000 - 60,000',
      mid: 'KSh 60,000 - 90,000',
      senior: 'KSh 90,000 - 160,000',
    },
    marketDemand: 'High',
    jobProspects: [
      'HR Specialist',
      'Recruitment Manager',
      'Training Manager',
      'Employee Relations Manager',
      'HR Director',
    ],
    programDuration: '4 years',
    skillsRequired: [
      'Leadership',
      'Communication',
      'Conflict resolution',
      'Strategic planning',
      'Employment law',
      'Data analysis',
    ],
    careerPath: {
      entryLevel: {
        roles: ['HR Assistant', 'Recruitment Assistant'],
        experience: '0-2 years',
        description:
          'Support recruitment processes and maintain employee records',
      },
      midLevel: {
        roles: ['HR Specialist', 'Training Coordinator'],
        experience: '2-5 years',
        description:
          'Manage recruitment campaigns and develop training programs',
      },
      seniorLevel: {
        roles: ['HR Manager', 'HR Business Partner'],
        experience: '5-10 years',
        description: 'Lead HR teams and develop HR strategies',
      },
      executiveLevel: {
        roles: ['Chief Human Resources Officer', 'VP of Human Resources'],
        experience: '10+ years',
        description: 'Set HR vision and drive culture transformation',
      },
    },
    certifications: [
      {
        name: 'Professional in Human Resources (PHR)',
        provider: 'HR Certification Institute',
        description: 'Validates knowledge of HR practices and principles',
      },
      {
        name: 'Society for Human Resource Management Certified Professional (SHRM-CP)',
        provider: 'SHRM',
        description: 'Demonstrates competency in HR knowledge and application',
      },
      {
        name: 'Certified Compensation Professional (CCP)',
        provider: 'WorldatWork',
        description: 'Certifies expertise in compensation and benefits',
      },
    ],
    industryTrends: [
      'Remote work management',
      'Employee wellness',
      'Diversity and inclusion',
      'HR analytics',
      'Digital HR transformation',
    ],
  },
  {
    title: 'Management Consultant',
    category: 'Business',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10,
    description:
      'Management consultants help organizations improve their performance by analyzing existing business problems and developing plans for improvement. They work with senior management to solve complex business challenges and implement strategic changes.',
    keySubjects: ['Business Studies', 'Economics', 'Mathematics', 'English'],
    requiredGrades: new Map([
      ['Business Studies', 'B'],
      ['Economics', 'B'],
      ['Mathematics', 'B'],
      ['English', 'B-'],
    ]),
    minimumMeanGrade: 'B',
    salary: {
      entry: 'KSh 60,000 - 90,000',
      mid: 'KSh 90,000 - 140,000',
      senior: 'KSh 140,000 - 250,000',
    },
    marketDemand: 'Very High',
    jobProspects: [
      'Business Analyst',
      'Strategy Consultant',
      'Operations Consultant',
      'Change Management Consultant',
      'Partner/Principal',
    ],
    programDuration: '4 years',
    skillsRequired: [
      'Problem-solving',
      'Strategic thinking',
      'Data analysis',
      'Presentation',
      'Leadership',
      'Change management',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Business Analyst', 'Research Associate'],
        experience: '0-2 years',
        description:
          'Conduct research and analysis, support senior consultants',
      },
      midLevel: {
        roles: ['Consultant', 'Senior Analyst'],
        experience: '2-5 years',
        description: 'Lead project workstreams and manage client relationships',
      },
      seniorLevel: {
        roles: ['Senior Consultant', 'Manager'],
        experience: '5-10 years',
        description: 'Lead consulting engagements and manage teams',
      },
      executiveLevel: {
        roles: ['Partner', 'Principal'],
        experience: '10+ years',
        description: 'Set firm strategy and lead major accounts',
      },
    },
    certifications: [
      {
        name: 'Certified Management Consultant (CMC)',
        provider: 'Institute of Management Consultants',
        description:
          'Validates professional competency in management consulting',
      },
      {
        name: 'Project Management Professional (PMP)',
        provider: 'Project Management Institute',
        description: 'Certifies project management expertise',
      },
      {
        name: 'Lean Six Sigma Black Belt',
        provider: 'Various Providers',
        description:
          'Demonstrates expertise in process improvement methodologies',
      },
    ],
    industryTrends: [
      'Digital transformation',
      'Sustainability consulting',
      'Data analytics',
      'Agile methodologies',
      'ESG consulting',
    ],
  },
  {
    title: 'Financial Analyst',
    category: 'Finance',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10,
    description:
      'Financial analysts evaluate investment opportunities, analyze financial data, and provide recommendations to help businesses and individuals make informed financial decisions. They assess the performance of stocks, bonds, and other types of investments.',
    keySubjects: ['Mathematics', 'Economics', 'Business Studies', 'English'],
    requiredGrades: new Map([
      ['Mathematics', 'B'],
      ['Economics', 'B'],
      ['Business Studies', 'B-'],
      ['English', 'C+'],
    ]),
    minimumMeanGrade: 'B',
    salary: {
      entry: 'KSh 50,000 - 75,000',
      mid: 'KSh 75,000 - 110,000',
      senior: 'KSh 110,000 - 200,000',
    },
    marketDemand: 'Very High',
    jobProspects: [
      'Investment Analyst',
      'Portfolio Manager',
      'Risk Analyst',
      'Corporate Finance Manager',
      'Chief Financial Officer',
    ],
    programDuration: '4 years',
    skillsRequired: [
      'Financial modeling',
      'Data analysis',
      'Excel proficiency',
      'Critical thinking',
      'Communication',
      'Attention to detail',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Financial Analyst', 'Financial Associate'],
        experience: '0-2 years',
        description: 'Prepare financial reports and conduct basic analysis',
      },
      midLevel: {
        roles: ['Financial Analyst', 'Senior Analyst'],
        experience: '2-5 years',
        description:
          'Analyze financial performance and create investment recommendations',
      },
      seniorLevel: {
        roles: ['Senior Financial Analyst', 'Finance Manager'],
        experience: '5-10 years',
        description: 'Lead financial planning and manage analyst teams',
      },
      executiveLevel: {
        roles: ['Chief Financial Officer', 'Finance Director'],
        experience: '10+ years',
        description: 'Set financial strategy and manage financial operations',
      },
    },
    certifications: [
      {
        name: 'Chartered Financial Analyst (CFA)',
        provider: 'CFA Institute',
        description: 'Premier credential for investment professionals',
      },
      {
        name: 'Financial Risk Manager (FRM)',
        provider: 'Global Association of Risk Professionals',
        description: 'Validates expertise in financial risk management',
      },
      {
        name: 'Certified Public Accountant (CPA)',
        provider: 'Various State Boards',
        description:
          'Certifies expertise in accounting and financial reporting',
      },
    ],
    industryTrends: [
      'Fintech integration',
      'ESG investing',
      'AI in finance',
      'Cryptocurrency analysis',
      'Regulatory technology',
    ],
  },
  {
    title: 'Investment Banker',
    category: 'Finance',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 11,
    description:
      'Investment bankers help corporations, governments, and other entities raise capital by underwriting and issuing securities. They also provide advisory services for mergers, acquisitions, and other financial transactions.',
    keySubjects: ['Mathematics', 'Economics', 'Business Studies', 'English'],
    requiredGrades: new Map([
      ['Mathematics', 'B+'],
      ['Economics', 'B+'],
      ['Business Studies', 'B'],
      ['English', 'B-'],
    ]),
    minimumMeanGrade: 'B+',
    salary: {
      entry: 'KSh 85,000 - 150,000',
      mid: 'KSh 150,000 - 250,000',
      senior: 'KSh 250,000 - 500,000',
    },
    marketDemand: 'High',
    jobProspects: [
      'Investment Banking Analyst',
      'Investment Banking Associate',
      'Vice President',
      'Director',
      'Managing Director',
    ],
    programDuration: '4 years',
    skillsRequired: [
      'Financial modeling',
      'Valuation',
      'Deal structuring',
      'Client management',
      'Presentation skills',
      'Analytical thinking',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Investment Banking Analyst', 'Financial Analyst'],
        experience: '0-2 years',
        description: 'Build financial models and prepare pitch books',
      },
      midLevel: {
        roles: ['Investment Banking Associate', 'Senior Analyst'],
        experience: '2-5 years',
        description: 'Manage deal processes and lead analyst teams',
      },
      seniorLevel: {
        roles: ['Vice President', 'Director'],
        experience: '5-10 years',
        description: 'Originate deals and manage client relationships',
      },
      executiveLevel: {
        roles: ['Managing Director', 'Senior Managing Director'],
        experience: '10+ years',
        description: 'Set division strategy and manage major clients',
      },
    },
    certifications: [
      {
        name: 'Series 7 - General Securities Representative',
        provider: 'FINRA',
        description: 'Licenses individuals to sell securities products',
      },
      {
        name: 'Series 63 - Uniform Securities Agent State Law',
        provider: 'FINRA',
        description: 'Qualifies individuals to solicit orders for securities',
      },
      {
        name: 'Chartered Financial Analyst (CFA)',
        provider: 'CFA Institute',
        description: 'Premier credential for investment professionals',
      },
    ],
    industryTrends: [
      'Digital transformation',
      'ESG financing',
      'SPAC transactions',
      'Fintech partnerships',
      'Regulatory changes',
    ],
  },
  {
    title: 'Actuary',
    category: 'Finance',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 11,
    description:
      'Actuaries analyze risk and uncertainty using mathematics, statistics, and financial theory. They help businesses and clients develop policies that minimize the cost of risk by assessing the probability of future events.',
    keySubjects: ['Mathematics', 'Statistics', 'Economics', 'Physics'],
    requiredGrades: new Map([
      ['Mathematics', 'A-'],
      ['Statistics', 'B+'],
      ['Economics', 'B'],
      ['Physics', 'B'],
    ]),
    minimumMeanGrade: 'B+',
    salary: {
      entry: 'KSh 60,000 - 85,000',
      mid: 'KSh 85,000 - 130,000',
      senior: 'KSh 130,000 - 220,000',
    },
    marketDemand: 'Very High',
    jobProspects: [
      'Actuarial Analyst',
      'Risk Analyst',
      'Senior Actuary',
      'Actuarial Manager',
      'Chief Actuary',
    ],
    programDuration: '4 years',
    skillsRequired: [
      'Advanced mathematics',
      'Statistical analysis',
      'Risk assessment',
      'Programming',
      'Communication',
      'Problem-solving',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Actuarial Analyst', 'Risk Analyst'],
        experience: '0-2 years',
        description:
          'Perform statistical analysis and support actuarial studies',
      },
      midLevel: {
        roles: ['Actuary', 'Senior Analyst'],
        experience: '2-5 years',
        description: 'Develop pricing models and assess risk factors',
      },
      seniorLevel: {
        roles: ['Senior Actuary', 'Actuarial Manager'],
        experience: '5-10 years',
        description: 'Lead actuarial teams and develop strategies',
      },
      executiveLevel: {
        roles: ['Chief Actuary', 'Chief Risk Officer'],
        experience: '10+ years',
        description: 'Set actuarial standards and drive risk strategy',
      },
    },
    certifications: [
      {
        name: 'Associate of the Society of Actuaries (ASA)',
        provider: 'Society of Actuaries',
        description:
          'Professional designation for actuaries in life insurance and pensions',
      },
      {
        name: 'Fellow of the Society of Actuaries (FSA)',
        provider: 'Society of Actuaries',
        description: 'Highest professional designation for actuaries',
      },
      {
        name: 'Associate of the Casualty Actuarial Society (ACAS)',
        provider: 'Casualty Actuarial Society',
        description:
          'Professional designation for property and casualty actuaries',
      },
    ],
    industryTrends: [
      'Predictive analytics',
      'Machine learning',
      'Climate risk modeling',
      'Cyber risk assessment',
      'Regulatory changes',
    ],
  },
];

export default batch4Careers;
