// BATCH 10: Diverse Career Opportunities - Supporting All Academic Levels
// Focus on Foundation and Standard tier careers to ensure inclusivity

const batchTenCareers = [
  {
    title: 'Security Guard',
    category: 'Security & Safety',
    tier: 'FOUNDATION',
    performanceLevel: 'BASIC',
    academicRequirementScore: 2, // D+ grade = 2 points
    description:
      'Protect property, assets, and people by monitoring premises, controlling access, and responding to security incidents while maintaining detailed logs and reports.',
    keySubjects: ['English', 'Mathematics'],
    requiredGrades: {},
    minimumMeanGrade: 'D+',
    marketDemand: 'Very High',
    jobProspects: [
      'Private Security Companies',
      'Banks and Financial Institutions',
      'Shopping Malls',
      'Residential Complexes',
      'Government Buildings',
    ],
    salary: {
      entry: '18000',
      mid: '28000',
      senior: '45000',
    },
    institutions: [],
    programDuration: '1-3 months',
    skillsRequired: [
      'Vigilance',
      'Communication Skills',
      'Physical Fitness',
      'Report Writing',
      'Conflict Resolution',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Security Guard', 'Access Control Officer'],
        experience: '0-2 years',
        description:
          'Monitor premises, check identification, and maintain security logs.',
      },
      midLevel: {
        roles: ['Senior Security Guard', 'Shift Supervisor'],
        experience: '3-6 years',
        description:
          'Lead security teams, train new guards, and handle complex security situations.',
      },
      seniorLevel: {
        roles: ['Security Supervisor', 'Site Manager'],
        experience: '7-12 years',
        description:
          'Manage security operations, develop security protocols, and coordinate with law enforcement.',
      },
      executiveLevel: {
        roles: ['Security Manager', 'Regional Security Director'],
        experience: '12+ years',
        description:
          'Oversee multiple security sites, develop security policies, and manage security budgets.',
      },
    },
    certifications: [
      {
        name: 'Private Security License',
        provider: 'Private Security Regulatory Authority',
        description: 'Required license for private security work in Kenya.',
      },
      {
        name: 'First Aid Certificate',
        provider: 'Kenya Red Cross',
        description: 'Basic first aid and emergency response training.',
      },
    ],
    industryTrends: [
      'Electronic Security Systems',
      'CCTV Monitoring',
      'Access Control Technology',
      'Mobile Security Apps',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  {
    title: 'House Help / Domestic Worker',
    category: 'Cleaning & Maintenance',
    tier: 'FOUNDATION',
    performanceLevel: 'BASIC',
    academicRequirementScore: 1, // D grade = 1 point
    description:
      'Provide household services including cleaning, cooking, laundry, and childcare while maintaining a safe and comfortable living environment for families.',
    keySubjects: ['English', 'Home Science'],
    requiredGrades: {},
    minimumMeanGrade: 'D',
    marketDemand: 'Very High',
    jobProspects: [
      'Private Households',
      'Domestic Agencies',
      'Hotels and Lodges',
      'Elderly Care Facilities',
      'Childcare Centers',
    ],
    salary: {
      entry: '12000',
      mid: '20000',
      senior: '35000',
    },
    institutions: [],
    programDuration: '2 weeks - 3 months',
    skillsRequired: [
      'Household Management',
      'Cooking Skills',
      'Childcare',
      'Time Management',
      'Reliability',
    ],
    careerPath: {
      entryLevel: {
        roles: ['House Help', 'Domestic Assistant'],
        experience: '0-2 years',
        description:
          'Perform basic household tasks, learn family routines, and maintain cleanliness.',
      },
      midLevel: {
        roles: ['Experienced House Manager', 'Nanny'],
        experience: '3-7 years',
        description:
          'Manage household operations, provide specialized childcare, and coordinate with other staff.',
      },
      seniorLevel: {
        roles: ['Head House Manager', 'Estate Supervisor'],
        experience: '8-15 years',
        description:
          'Supervise household staff, manage household budgets, and coordinate maintenance.',
      },
      executiveLevel: {
        roles: ['Estate Manager', 'Domestic Services Coordinator'],
        experience: '15+ years',
        description:
          'Manage large estates, coordinate multiple properties, and train domestic staff.',
      },
    },
    certifications: [
      {
        name: 'Domestic Worker Certificate',
        provider: 'Kenya Institute of Social Work',
        description:
          'Training in household management and professional conduct.',
      },
      {
        name: 'Childcare Certificate',
        provider: 'Early Childhood Development Association',
        description: 'Specialized training in child development and care.',
      },
    ],
    industryTrends: [
      'Professional Domestic Services',
      'Specialized Childcare',
      'Elder Care Services',
      'Smart Home Technology',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  {
    title: 'Taxi/Uber Driver',
    category: 'Transportation',
    tier: 'FOUNDATION',
    performanceLevel: 'BASIC',
    academicRequirementScore: 2, // D+ grade = 2 points
    description:
      'Provide transportation services to passengers using personal or company vehicles, ensuring safe and efficient travel while maintaining excellent customer service.',
    keySubjects: ['English', 'Mathematics', 'Geography'],
    requiredGrades: {},
    minimumMeanGrade: 'D+',
    marketDemand: 'Very High',
    jobProspects: [
      'Ride-sharing Companies',
      'Taxi Companies',
      'Self Employment',
      'Corporate Transport',
      'Tourism Industry',
    ],
    salary: {
      entry: '20000',
      mid: '35000',
      senior: '55000',
    },
    institutions: [],
    programDuration: '1-2 weeks',
    skillsRequired: [
      'Driving Skills',
      'Navigation',
      'Customer Service',
      'Vehicle Maintenance',
      'Time Management',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Taxi Driver', 'Ride-share Driver'],
        experience: '0-2 years',
        description:
          'Provide basic transportation services, learn routes, and build customer base.',
      },
      midLevel: {
        roles: ['Experienced Driver', 'Premium Service Driver'],
        experience: '3-6 years',
        description:
          'Offer specialized services, maintain high ratings, and develop regular clientele.',
      },
      seniorLevel: {
        roles: ['Fleet Owner', 'Driver Trainer'],
        experience: '7-12 years',
        description:
          'Own multiple vehicles, train new drivers, and manage transportation operations.',
      },
      executiveLevel: {
        roles: ['Transport Business Owner', 'Fleet Manager'],
        experience: '12+ years',
        description:
          'Manage large fleets, develop transport businesses, and coordinate logistics operations.',
      },
    },
    certifications: [
      {
        name: 'Professional Driving License',
        provider: 'National Transport and Safety Authority',
        description: 'Required license for commercial passenger transport.',
      },
      {
        name: 'Defensive Driving Certificate',
        provider: 'AA Kenya',
        description:
          'Advanced driving safety and accident prevention training.',
      },
    ],
    industryTrends: [
      'Electric Vehicles',
      'GPS Navigation Systems',
      'Mobile Payment Integration',
      'Ride-sharing Technology',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  {
    title: 'Food Service Worker',
    category: 'Hospitality & Food Service',
    tier: 'FOUNDATION',
    performanceLevel: 'BASIC',
    academicRequirementScore: 2, // D+ grade = 2 points
    description:
      'Prepare and serve food in restaurants, cafeterias, and food establishments while maintaining hygiene standards and providing excellent customer service.',
    keySubjects: ['English', 'Home Science', 'Mathematics'],
    requiredGrades: {},
    minimumMeanGrade: 'D+',
    marketDemand: 'Very High',
    jobProspects: [
      'Restaurants',
      'Hotels',
      'Cafeterias',
      'Fast Food Chains',
      'Catering Companies',
    ],
    salary: {
      entry: '15000',
      mid: '25000',
      senior: '40000',
    },
    institutions: [],
    programDuration: '2-6 months',
    skillsRequired: [
      'Food Preparation',
      'Customer Service',
      'Hygiene Standards',
      'Teamwork',
      'Time Management',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Kitchen Assistant', 'Server'],
        experience: '0-2 years',
        description:
          'Assist with food preparation, serve customers, and maintain cleanliness.',
      },
      midLevel: {
        roles: ['Cook', 'Shift Supervisor'],
        experience: '3-6 years',
        description:
          'Prepare meals independently, supervise junior staff, and manage food quality.',
      },
      seniorLevel: {
        roles: ['Head Cook', 'Kitchen Manager'],
        experience: '7-12 years',
        description:
          'Manage kitchen operations, develop menus, and ensure food safety compliance.',
      },
      executiveLevel: {
        roles: ['Restaurant Manager', 'Food Service Director'],
        experience: '12+ years',
        description:
          'Oversee entire food operations, manage multiple locations, and develop business strategies.',
      },
    },
    certifications: [
      {
        name: "Food Handler's Certificate",
        provider: 'Ministry of Health',
        description: 'Required certification for food service workers.',
      },
      {
        name: 'Culinary Arts Certificate',
        provider: 'Kenya Utalii College',
        description: 'Professional training in cooking and food preparation.',
      },
    ],
    industryTrends: [
      'Food Delivery Services',
      'Healthy Menu Options',
      'Sustainable Food Practices',
      'Digital Ordering Systems',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  {
    title: 'Retail Sales Associate',
    category: 'Business',
    tier: 'STANDARD',
    performanceLevel: 'AVERAGE',
    academicRequirementScore: 5, // C- grade = 5 points
    description:
      'Assist customers with purchases, maintain store displays, handle transactions, and provide product information while ensuring excellent customer satisfaction.',
    keySubjects: ['English', 'Mathematics', 'Business'],
    requiredGrades: {},
    minimumMeanGrade: 'C-',
    marketDemand: 'High',
    jobProspects: [
      'Retail Stores',
      'Supermarkets',
      'Department Stores',
      'Specialty Shops',
      'Online Retail',
    ],
    salary: {
      entry: '20000',
      mid: '32000',
      senior: '50000',
    },
    institutions: [],
    programDuration: '1-3 months',
    skillsRequired: [
      'Customer Service',
      'Sales Techniques',
      'Product Knowledge',
      'Cash Handling',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Sales Associate', 'Cashier'],
        experience: '0-2 years',
        description:
          'Assist customers, process transactions, and maintain store appearance.',
      },
      midLevel: {
        roles: ['Senior Sales Associate', 'Department Supervisor'],
        experience: '3-6 years',
        description:
          'Lead sales teams, manage inventory, and train new employees.',
      },
      seniorLevel: {
        roles: ['Store Manager', 'Regional Supervisor'],
        experience: '7-12 years',
        description:
          'Manage store operations, develop sales strategies, and oversee multiple locations.',
      },
      executiveLevel: {
        roles: ['District Manager', 'Retail Director'],
        experience: '12+ years',
        description:
          'Oversee multiple stores, develop retail policies, and drive business growth.',
      },
    },
    certifications: [
      {
        name: 'Retail Sales Certificate',
        provider: 'Kenya Institute of Management',
        description:
          'Professional training in retail sales and customer service.',
      },
      {
        name: 'Customer Service Excellence',
        provider: 'Customer Service Institute',
        description: 'Advanced customer service and relationship management.',
      },
    ],
    industryTrends: [
      'E-commerce Integration',
      'Mobile Payment Systems',
      'Personalized Shopping',
      'Omnichannel Retail',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  {
    title: 'Construction Laborer',
    category: 'Construction',
    tier: 'FOUNDATION',
    performanceLevel: 'BASIC',
    academicRequirementScore: 2, // D+ grade = 2 points
    description:
      'Perform physical labor tasks on construction sites including digging, lifting, carrying materials, and assisting skilled tradespeople with building projects.',
    keySubjects: ['Mathematics', 'Physics', 'Technical Drawing'],
    requiredGrades: {},
    minimumMeanGrade: 'D+',
    marketDemand: 'Very High',
    jobProspects: [
      'Construction Companies',
      'Real Estate Developers',
      'Government Projects',
      'Infrastructure Companies',
      'Self Employment',
    ],
    salary: {
      entry: '18000',
      mid: '30000',
      senior: '48000',
    },
    institutions: [],
    programDuration: '2-4 weeks',
    skillsRequired: [
      'Physical Strength',
      'Safety Awareness',
      'Tool Usage',
      'Teamwork',
      'Following Instructions',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Construction Laborer', 'Site Assistant'],
        experience: '0-2 years',
        description:
          'Perform basic construction tasks, learn safety procedures, and assist skilled workers.',
      },
      midLevel: {
        roles: ['Skilled Laborer', 'Team Leader'],
        experience: '3-6 years',
        description:
          'Specialize in specific construction tasks, lead work teams, and train new laborers.',
      },
      seniorLevel: {
        roles: ['Site Supervisor', 'Foreman'],
        experience: '7-12 years',
        description:
          'Supervise construction activities, ensure quality control, and coordinate with contractors.',
      },
      executiveLevel: {
        roles: ['Construction Manager', 'Project Coordinator'],
        experience: '12+ years',
        description:
          'Manage construction projects, coordinate resources, and ensure project completion.',
      },
    },
    certifications: [
      {
        name: 'Construction Safety Certificate',
        provider: 'Directorate of Occupational Safety and Health',
        description: 'Safety training for construction workers.',
      },
      {
        name: 'Basic Construction Skills',
        provider: 'National Industrial Training Authority',
        description: 'Fundamental construction techniques and safety.',
      },
    ],
    industryTrends: [
      'Green Building Practices',
      'Prefabricated Construction',
      'Safety Technology',
      'Sustainable Materials',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  {
    title: 'Hair Stylist / Barber',
    category: 'Beauty & Personal Care',
    tier: 'STANDARD',
    performanceLevel: 'AVERAGE',
    academicRequirementScore: 4, // D+ to C- grade = 4 points
    description:
      'Cut, style, and treat hair for clients while providing beauty consultations, maintaining hygiene standards, and staying current with fashion trends.',
    keySubjects: ['English', 'Art', 'Chemistry'],
    requiredGrades: {},
    minimumMeanGrade: 'D+',
    marketDemand: 'High',
    jobProspects: [
      'Hair Salons',
      'Barbershops',
      'Beauty Spas',
      'Hotels',
      'Self Employment',
    ],
    salary: {
      entry: '15000',
      mid: '28000',
      senior: '45000',
    },
    institutions: [],
    programDuration: '6 months - 2 years',
    skillsRequired: [
      'Hair Cutting Techniques',
      'Color Application',
      'Customer Consultation',
      'Creativity',
      'Hand-Eye Coordination',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Junior Stylist', 'Apprentice Barber'],
        experience: '0-2 years',
        description:
          'Learn basic cutting techniques, assist senior stylists, and build client base.',
      },
      midLevel: {
        roles: ['Hair Stylist', 'Barber'],
        experience: '3-6 years',
        description:
          'Provide full hair services, develop specializations, and maintain regular clientele.',
      },
      seniorLevel: {
        roles: ['Senior Stylist', 'Salon Manager'],
        experience: '7-12 years',
        description:
          'Manage salon operations, train junior staff, and develop business strategies.',
      },
      executiveLevel: {
        roles: ['Salon Owner', 'Beauty Business Owner'],
        experience: '12+ years',
        description:
          'Own multiple salons, develop beauty brands, and mentor other stylists.',
      },
    },
    certifications: [
      {
        name: 'Cosmetology License',
        provider: 'Kenya Bureau of Standards',
        description: 'Required license for professional hair styling services.',
      },
      {
        name: 'Advanced Hair Styling Certificate',
        provider: 'Beauty Training Institutes',
        description: 'Specialized training in advanced hair techniques.',
      },
    ],
    industryTrends: [
      'Organic Hair Products',
      'Digital Booking Systems',
      'Specialized Treatments',
      'Social Media Marketing',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },

  {
    title: 'Community Health Worker',
    category: 'Healthcare',
    tier: 'STANDARD',
    performanceLevel: 'AVERAGE',
    academicRequirementScore: 6, // C grade = 6 points
    description:
      'Provide basic health services and education to communities, promote preventive care, and connect people with healthcare resources while working closely with healthcare professionals.',
    keySubjects: ['Biology', 'English', 'Geography', 'Health Education'],
    requiredGrades: {},
    minimumMeanGrade: 'C',
    marketDemand: 'High',
    jobProspects: [
      'Community Health Centers',
      'NGOs',
      'Government Health Programs',
      'Faith-Based Organizations',
      'International Health Organizations',
    ],
    salary: {
      entry: '25000',
      mid: '40000',
      senior: '60000',
    },
    institutions: [],
    programDuration: '6 months - 1 year',
    skillsRequired: [
      'Health Education',
      'Community Engagement',
      'Basic Medical Knowledge',
      'Communication',
      'Cultural Sensitivity',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Community Health Worker', 'Health Educator'],
        experience: '0-3 years',
        description:
          'Provide basic health services, conduct health education, and support community programs.',
      },
      midLevel: {
        roles: ['Senior Community Health Worker', 'Program Coordinator'],
        experience: '4-7 years',
        description:
          'Coordinate health programs, train other workers, and develop community partnerships.',
      },
      seniorLevel: {
        roles: ['Community Health Supervisor', 'Program Manager'],
        experience: '8-12 years',
        description:
          'Manage health programs, supervise teams, and develop health policies.',
      },
      executiveLevel: {
        roles: ['Community Health Director', 'Public Health Manager'],
        experience: '12+ years',
        description:
          'Lead community health initiatives, manage large programs, and influence health policy.',
      },
    },
    certifications: [
      {
        name: 'Community Health Worker Certificate',
        provider: 'Ministry of Health',
        description: 'Official certification for community health work.',
      },
      {
        name: 'First Aid and CPR',
        provider: 'Kenya Red Cross',
        description: 'Emergency response and basic life support training.',
      },
    ],
    industryTrends: [
      'Digital Health Tools',
      'Preventive Care Focus',
      'Community-Based Care',
      'Health Data Collection',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
];

export default batchTenCareers;
