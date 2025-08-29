// BATCH 5: EDUCATION CAREERS - Updated with Performance-Aware Filtering Fields

const educationCareersData = [
  {
    title: 'Teacher',
    category: 'Education',
    tier: 'PREMIUM',
    performanceLevel: 'GOOD',
    academicRequirementScore: 9, // B- grade = 9 points
    description:
      'Educate students in various subjects, develop lesson plans, assess student progress, and create a positive learning environment to foster intellectual and social development.',
    keySubjects: ['Education', 'Psychology', 'Subject Specialization'],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'High',
    jobProspects: [
      'Public Schools',
      'Private Schools',
      'International Schools',
      'Online Education Platforms',
      'Tutoring Services',
    ],
    salary: {
      entry: '30000',
      mid: '50000',
      senior: '75000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Curriculum Development',
      'Classroom Management',
      'Assessment',
      'Communication',
      'Adaptability',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Teacher', 'Teaching Assistant'],
        experience: '0-5 years',
        description:
          'Develop and deliver lessons, assess student learning, and manage classroom environments.',
      },
      midLevel: {
        roles: ['Lead Teacher', 'Department Head'],
        experience: '6-10 years',
        description:
          'Mentor new teachers, develop curriculum, and lead subject departments.',
      },
      seniorLevel: {
        roles: ['Instructional Coach', 'Curriculum Specialist'],
        experience: '11-15 years',
        description:
          'Design school-wide curriculum, train teachers, and implement educational initiatives.',
      },
      executiveLevel: {
        roles: ['Principal', 'Education Director'],
        experience: '15+ years',
        description:
          'Lead educational institutions, set educational vision, and manage school operations.',
      },
    },
    certifications: [
      {
        name: 'Teaching License/Certification',
        provider: 'State Education Department',
        description: 'Required credential to teach in public schools.',
      },
      {
        name: 'National Board Certification',
        provider: 'National Board for Professional Teaching Standards',
        description:
          'Advanced certification demonstrating accomplished teaching practice.',
      },
    ],
    industryTrends: [
      'Blended Learning',
      'Social-Emotional Learning',
      'Personalized Education',
      'Technology Integration',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'School Counselor',
    category: 'Education',
    tier: 'PREMIUM',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10, // B grade = 10 points
    description:
      "Support students' academic, social, and emotional development, helping them navigate educational and personal challenges while preparing for college and career success.",
    keySubjects: ['Psychology', 'Counseling', 'Education', 'Sociology'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Medium',
    jobProspects: [
      'Public Schools',
      'Private Schools',
      'Colleges',
      'Community Centers',
      'Youth Organizations',
    ],
    salary: {
      entry: '40000',
      mid: '60000',
      senior: '80000',
    },
    institutions: [],
    programDuration: "6 years (including Master's)",
    skillsRequired: [
      'Counseling Techniques',
      'Assessment',
      'Career Guidance',
      'Crisis Intervention',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['School Counselor', 'Guidance Counselor'],
        experience: '0-5 years',
        description:
          'Provide individual and group counseling, support academic planning, and assist with college applications.',
      },
      midLevel: {
        roles: ['Lead Counselor', 'Counseling Department Chair'],
        experience: '6-10 years',
        description:
          'Coordinate counseling programs, mentor new counselors, and develop counseling initiatives.',
      },
      seniorLevel: {
        roles: ['Director of Counseling', 'Student Services Coordinator'],
        experience: '11-15 years',
        description:
          'Lead counseling departments, develop comprehensive guidance programs, and collaborate with school leadership.',
      },
      executiveLevel: {
        roles: [
          'District Counseling Supervisor',
          'Director of Student Services',
        ],
        experience: '15+ years',
        description:
          'Set counseling vision for multiple schools, develop district-wide programs, and advocate for student support services.',
      },
    },
    certifications: [
      {
        name: 'School Counselor Certification/License',
        provider: 'State Education Department',
        description:
          'Required credential to work as a school counselor in public schools.',
      },
      {
        name: 'National Certified Counselor (NCC)',
        provider: 'National Board for Certified Counselors',
        description:
          'Validates expertise in counseling principles and practices.',
      },
    ],
    industryTrends: [
      'Trauma-Informed Counseling',
      'Virtual Counseling',
      'Data-Driven Interventions',
      'College and Career Readiness',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'University Professor',
    category: 'Education',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 11, // A- grade = 11 points
    description:
      'Teach courses in their area of expertise at the college level, conduct research, publish scholarly works, and contribute to their academic field while mentoring students.',
    keySubjects: [
      'Subject Specialization',
      'Research Methodology',
      'Education',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    marketDemand: 'Medium',
    jobProspects: [
      'Universities',
      'Colleges',
      'Research Institutions',
      'Think Tanks',
      'Government Agencies',
    ],
    salary: {
      entry: '60000',
      mid: '85000',
      senior: '130000',
    },
    institutions: [],
    programDuration: '8-10 years (including PhD)',
    skillsRequired: [
      'Research',
      'Teaching',
      'Grant Writing',
      'Publishing',
      'Mentoring',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Assistant Professor', 'Lecturer'],
        experience: '0-6 years',
        description:
          'Teach undergraduate courses, establish research agenda, and begin publishing scholarly work.',
      },
      midLevel: {
        roles: ['Associate Professor', 'Research Professor'],
        experience: '7-12 years',
        description:
          'Teach graduate courses, secure research funding, and publish significant research.',
      },
      seniorLevel: {
        roles: ['Full Professor', 'Department Chair'],
        experience: '13-20 years',
        description:
          'Lead academic departments, mentor junior faculty, and contribute major works to their field.',
      },
      executiveLevel: {
        roles: ['Dean', 'Provost'],
        experience: '20+ years',
        description:
          'Set academic vision for colleges or universities, oversee multiple departments, and shape institutional policy.',
      },
    },
    certifications: [
      {
        name: 'PhD in Subject Area',
        provider: 'Accredited University',
        description: 'Terminal degree required for most professor positions.',
      },
    ],
    industryTrends: [
      'Online Education',
      'Interdisciplinary Research',
      'Open Access Publishing',
      'Alternative Academic Careers',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Educational Administrator',
    category: 'Education',
    tier: 'PREMIUM',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10, // B grade = 10 points
    description:
      'Plan, direct, and coordinate educational activities in schools, colleges, or universities, overseeing curriculum, staff, budgets, and policies to ensure effective educational programs.',
    keySubjects: ['Education', 'Administration', 'Leadership', 'Policy'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'Medium',
    jobProspects: [
      'Schools',
      'School Districts',
      'Colleges',
      'Universities',
      'Education Departments',
    ],
    salary: {
      entry: '60000',
      mid: '90000',
      senior: '130000',
    },
    institutions: [],
    programDuration: "6-8 years (including Master's)",
    skillsRequired: [
      'Leadership',
      'Budget Management',
      'Policy Development',
      'Staff Supervision',
      'Strategic Planning',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Assistant Principal', 'Program Coordinator'],
        experience: '3-5 years',
        description:
          'Support school operations, supervise staff, and implement educational programs.',
      },
      midLevel: {
        roles: ['Principal', 'Department Director'],
        experience: '6-10 years',
        description:
          'Lead educational institutions, develop school policies, and manage educational programs.',
      },
      seniorLevel: {
        roles: ['Superintendent', 'Dean'],
        experience: '11-15 years',
        description:
          'Oversee multiple schools or college departments, set educational vision, and manage large budgets.',
      },
      executiveLevel: {
        roles: ['Chief Academic Officer', 'University President'],
        experience: '15+ years',
        description:
          'Lead educational systems, shape educational policy, and manage complex educational organizations.',
      },
    },
    certifications: [
      {
        name: 'Administrative License/Certification',
        provider: 'State Education Department',
        description:
          'Required credential for school administrators in public schools.',
      },
      {
        name: 'Superintendent Certification',
        provider: 'State Education Department',
        description: 'Required credential for district superintendents.',
      },
    ],
    industryTrends: [
      'Data-Driven Decision Making',
      'Equity-Focused Leadership',
      'Community Partnerships',
      'Digital Transformation',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Special Education Teacher',
    category: 'Education',
    tier: 'PREMIUM',
    performanceLevel: 'GOOD',
    academicRequirementScore: 9, // B- grade = 9 points
    description:
      'Work with students who have a wide range of learning, mental, emotional, and physical disabilities, adapting general education lessons and teaching various subjects to students with mild to moderate disabilities.',
    keySubjects: [
      'Special Education',
      'Psychology',
      'Child Development',
      'Education',
    ],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'Very High',
    jobProspects: [
      'Public Schools',
      'Private Schools',
      'Special Education Centers',
      'Hospitals',
      'Residential Facilities',
    ],
    salary: {
      entry: '40000',
      mid: '60000',
      senior: '80000',
    },
    institutions: [],
    programDuration: '4 years',
    skillsRequired: [
      'Individualized Education Plans',
      'Adaptive Teaching',
      'Behavior Management',
      'Assessment',
      'Collaboration',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Special Education Teacher', 'Resource Teacher'],
        experience: '0-5 years',
        description:
          'Develop and implement IEPs, adapt curriculum, and provide specialized instruction to students with disabilities.',
      },
      midLevel: {
        roles: [
          'Lead Special Education Teacher',
          'Special Education Coordinator',
        ],
        experience: '6-10 years',
        description:
          'Coordinate special education programs, mentor new teachers, and develop specialized curriculum.',
      },
      seniorLevel: {
        roles: ['Special Education Specialist', 'Program Director'],
        experience: '11-15 years',
        description:
          'Design district-wide special education initiatives, train teachers, and ensure compliance with regulations.',
      },
      executiveLevel: {
        roles: [
          'Director of Special Education',
          'Special Education Administrator',
        ],
        experience: '15+ years',
        description:
          'Set special education vision, manage special education departments, and advocate for inclusive policies.',
      },
    },
    certifications: [
      {
        name: 'Special Education Teaching License',
        provider: 'State Education Department',
        description:
          'Required credential to teach special education in public schools.',
      },
      {
        name: 'Board Certified Behavior Analyst (BCBA)',
        provider: 'Behavior Analyst Certification Board',
        description:
          'Validates expertise in behavior analysis for students with behavioral challenges.',
      },
    ],
    industryTrends: [
      'Inclusive Education',
      'Assistive Technology',
      'Universal Design for Learning',
      'Positive Behavioral Interventions',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
];

export default educationCareersData;
