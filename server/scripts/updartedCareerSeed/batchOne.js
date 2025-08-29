// BATCH 1: TECHNOLOGY CAREERS (First 5 careers)
// Updated with performance-aware filtering fields

const batch1Careers = [
  // TECHNOLOGY CAREERS
  {
    title: 'Software Engineer',
    category: 'Technology',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10, // Based on minimumMeanGrade 'B' = 10 points
    description:
      'Design, develop, and maintain software systems and applications using programming languages, frameworks, and software development methodologies to solve complex problems.',
    keySubjects: ['Computer Science', 'Mathematics', 'Physics'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Very High',
    jobProspects: [
      'Tech Companies',
      'Financial Institutions',
      'Government Agencies',
      'Startups',
      'Consulting Firms',
    ],
    salary: {
      entry: '40000',
      mid: '80000',
      senior: '150000',
    },
    institutions: [], // Will be populated later
    programDuration: '4 years',
    skillsRequired: [
      'Programming',
      'Problem Solving',
      'Algorithms',
      'Data Structures',
      'Version Control',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Software Engineer', 'Software Developer I'],
        experience: '0-2 years',
        description:
          'Focus on learning codebases, fixing bugs, and implementing small features under supervision.',
      },
      midLevel: {
        roles: ['Software Engineer II', 'Senior Developer'],
        experience: '3-5 years',
        description:
          'Lead feature development, mentor junior developers, and contribute to architectural decisions.',
      },
      seniorLevel: {
        roles: ['Senior Software Engineer', 'Tech Lead'],
        experience: '6-10 years',
        description:
          'Design system architecture, make critical technical decisions, and lead development teams.',
      },
      executiveLevel: {
        roles: ['Principal Engineer', 'Chief Technology Officer'],
        experience: '10+ years',
        description:
          'Set technical direction for the organization, make strategic decisions, and oversee multiple teams.',
      },
    },
    certifications: [
      {
        name: 'AWS Certified Developer',
        provider: 'Amazon Web Services',
        description:
          'Validates expertise in developing applications for the AWS platform.',
      },
      {
        name: 'Microsoft Certified: Azure Developer Associate',
        provider: 'Microsoft',
        description:
          'Demonstrates proficiency in cloud development using Azure services.',
      },
    ],
    industryTrends: [
      'Cloud Computing',
      'Artificial Intelligence',
      'DevOps',
      'Microservices Architecture',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: 'Data Scientist',
    category: 'Technology',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 11, // Based on minimumMeanGrade 'B+' = 11 points
    description:
      'Analyze and interpret complex data sets to help organizations make better decisions through statistical analysis, machine learning, and data visualization.',
    keySubjects: ['Statistics', 'Mathematics', 'Computer Science'],
    requiredGrades: {},
    minimumMeanGrade: 'B+',
    marketDemand: 'Very High',
    jobProspects: [
      'Tech Companies',
      'Financial Services',
      'Healthcare',
      'E-commerce',
      'Research Institutions',
    ],
    salary: {
      entry: '50000',
      mid: '90000',
      senior: '160000',
    },
    institutions: [], // Will be populated later
    programDuration: '4-5 years',
    skillsRequired: [
      'Statistical Analysis',
      'Machine Learning',
      'Python',
      'R',
      'SQL',
      'Data Visualization',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Data Scientist', 'Data Analyst'],
        experience: '0-2 years',
        description:
          'Work on data cleaning, basic analysis, and implementing established models.',
      },
      midLevel: {
        roles: ['Data Scientist', 'Machine Learning Engineer'],
        experience: '3-5 years',
        description:
          'Develop complex models, lead analysis projects, and translate business problems into data questions.',
      },
      seniorLevel: {
        roles: ['Senior Data Scientist', 'Lead Data Scientist'],
        experience: '6-10 years',
        description:
          'Design data strategy, develop novel algorithms, and lead teams of data professionals.',
      },
      executiveLevel: {
        roles: ['Chief Data Officer', 'Director of Data Science'],
        experience: '10+ years',
        description:
          'Set data strategy for the organization, oversee multiple teams, and align data initiatives with business goals.',
      },
    },
    certifications: [
      {
        name: 'TensorFlow Developer Certificate',
        provider: 'Google',
        description:
          'Validates skills in using TensorFlow to build and train models.',
      },
      {
        name: 'Microsoft Certified: Azure Data Scientist Associate',
        provider: 'Microsoft',
        description:
          'Demonstrates expertise in applying data science and machine learning on Azure.',
      },
    ],
    industryTrends: [
      'Big Data',
      'Deep Learning',
      'Natural Language Processing',
      'Automated Machine Learning',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: 'Cybersecurity Analyst',
    category: 'Technology',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10, // Based on minimumMeanGrade 'B' = 10 points
    description:
      'Protect computer systems and networks from information disclosure, theft, and damage to hardware, software, or electronic data through implementation of security measures.',
    keySubjects: ['Computer Science', 'Information Technology', 'Cryptography'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Very High',
    jobProspects: [
      'Government Agencies',
      'Financial Institutions',
      'Healthcare Organizations',
      'Tech Companies',
      'Consulting Firms',
    ],
    salary: {
      entry: '45000',
      mid: '85000',
      senior: '140000',
    },
    institutions: [], // Will be populated later
    programDuration: '4 years',
    skillsRequired: [
      'Network Security',
      'Penetration Testing',
      'Security Protocols',
      'Risk Assessment',
      'Incident Response',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Security Analyst', 'Information Security Specialist'],
        experience: '0-2 years',
        description:
          'Monitor security systems, respond to alerts, and implement security controls.',
      },
      midLevel: {
        roles: ['Cybersecurity Consultant', 'Security Engineer'],
        experience: '3-5 years',
        description:
          'Design security solutions, conduct vulnerability assessments, and lead security projects.',
      },
      seniorLevel: {
        roles: ['Security Architect', 'Cybersecurity Manager'],
        experience: '6-10 years',
        description:
          'Develop security strategies, oversee security operations, and manage security teams.',
      },
      executiveLevel: {
        roles: ['Chief Information Security Officer', 'Director of Security'],
        experience: '10+ years',
        description:
          'Set security vision, develop security policies, and ensure organizational compliance with regulations.',
      },
    },
    certifications: [
      {
        name: 'Certified Information Systems Security Professional (CISSP)',
        provider: 'ISC²',
        description:
          'Demonstrates expertise in designing, implementing, and managing cybersecurity programs.',
      },
      {
        name: 'Certified Ethical Hacker (CEH)',
        provider: 'EC-Council',
        description:
          'Validates skills in identifying vulnerabilities in target systems using the same methods as hackers.',
      },
    ],
    industryTrends: [
      'Zero Trust Security',
      'Cloud Security',
      'AI in Cybersecurity',
      'IoT Security',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'UX/UI Designer',
    category: 'Technology',
    tier: 'PREMIUM',
    performanceLevel: 'GOOD',
    academicRequirementScore: 7, // Based on minimumMeanGrade 'C+' = 7 points
    description:
      'Create intuitive, accessible, and enjoyable digital experiences by combining user research, visual design, and interaction design principles to improve user satisfaction.',
    keySubjects: ['Design', 'Psychology', 'Computer Science'],
    requiredGrades: {},
    minimumMeanGrade: 'C+',
    marketDemand: 'High',
    jobProspects: [
      'Tech Companies',
      'Design Agencies',
      'E-commerce',
      'Media Companies',
      'Startups',
    ],
    salary: {
      entry: '35000',
      mid: '70000',
      senior: '120000',
    },
    institutions: [], // Will be populated later
    programDuration: '3-4 years',
    skillsRequired: [
      'User Research',
      'Wireframing',
      'Prototyping',
      'Visual Design',
      'Usability Testing',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior UX Designer', 'UI Designer'],
        experience: '0-2 years',
        description:
          'Create wireframes, assist with user research, and design interface elements.',
      },
      midLevel: {
        roles: ['UX/UI Designer', 'Product Designer'],
        experience: '3-5 years',
        description:
          'Lead design projects, conduct user research, and create comprehensive design systems.',
      },
      seniorLevel: {
        roles: ['Senior UX Designer', 'Design Lead'],
        experience: '6-10 years',
        description:
          'Define design strategy, mentor junior designers, and collaborate with product and engineering leaders.',
      },
      executiveLevel: {
        roles: ['Design Director', 'VP of Design'],
        experience: '10+ years',
        description:
          'Set design vision, build design teams, and align design with business objectives.',
      },
    },
    certifications: [
      {
        name: 'Certified User Experience Professional (CUXP)',
        provider: 'Nielsen Norman Group',
        description:
          'Validates expertise in user experience research and design.',
      },
    ],
    industryTrends: [
      'Design Systems',
      'Voice User Interfaces',
      'Augmented Reality',
      'Accessibility Design',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Cloud Solutions Architect',
    category: 'Technology',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10, // Based on minimumMeanGrade 'B' = 10 points
    description:
      'Design and implement cloud computing solutions for organizations, ensuring scalability, security, and cost-effectiveness while aligning with business objectives.',
    keySubjects: [
      'Computer Science',
      'Information Technology',
      'Systems Engineering',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Very High',
    jobProspects: [
      'Cloud Service Providers',
      'Tech Companies',
      'Financial Institutions',
      'Consulting Firms',
      'Healthcare Organizations',
    ],
    salary: {
      entry: '60000',
      mid: '110000',
      senior: '180000',
    },
    institutions: [], // Will be populated later
    programDuration: '4 years',
    skillsRequired: [
      'Cloud Platforms',
      'Network Architecture',
      'Security',
      'Infrastructure as Code',
      'Containerization',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Cloud Engineer', 'Solutions Engineer'],
        experience: '1-3 years',
        description:
          'Implement cloud solutions, assist with migrations, and support cloud infrastructure.',
      },
      midLevel: {
        roles: ['Cloud Architect', 'DevOps Engineer'],
        experience: '4-7 years',
        description:
          'Design cloud architectures, optimize cloud resources, and implement best practices.',
      },
      seniorLevel: {
        roles: ['Senior Cloud Architect', 'Cloud Strategy Lead'],
        experience: '8-12 years',
        description:
          'Develop cloud strategies, lead complex migrations, and design enterprise-scale solutions.',
      },
      executiveLevel: {
        roles: ['Chief Cloud Architect', 'VP of Cloud Engineering'],
        experience: '12+ years',
        description:
          'Set cloud vision, develop cloud governance frameworks, and lead digital transformation initiatives.',
      },
    },
    certifications: [
      {
        name: 'AWS Certified Solutions Architect - Professional',
        provider: 'Amazon Web Services',
        description:
          'Validates expertise in designing distributed applications and systems on AWS.',
      },
      {
        name: 'Google Cloud Professional Cloud Architect',
        provider: 'Google',
        description:
          'Demonstrates ability to design, develop, and manage robust, secure, scalable cloud solutions.',
      },
    ],
    industryTrends: [
      'Multi-cloud Strategy',
      'Serverless Computing',
      'Edge Computing',
      'FinOps',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
];

export default batch1Careers;
