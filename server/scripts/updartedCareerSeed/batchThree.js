const healthcareCareers = [
  {
    title: 'Medical Doctor',
    category: 'Healthcare',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 11, // A- grade = 11 points
    description:
      'Diagnose and treat illnesses, injuries, and other health conditions in patients through examination, testing, and prescribing medications or other treatments to promote wellness.',
    keySubjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    marketDemand: 'Very High',
    jobProspects: [
      'Hospitals',
      'Private Practice',
      'Research Institutions',
      'Public Health Agencies',
      'International Organizations',
    ],
    salary: {
      entry: '60000',
      mid: '150000',
      senior: '300000',
    },
    institutions: [], // Will be populated later
    programDuration: '6-7 years',
    skillsRequired: [
      'Clinical Skills',
      'Diagnostic Reasoning',
      'Patient Communication',
      'Medical Knowledge',
      'Critical Thinking',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Medical Intern', 'Resident'],
        experience: '1-5 years',
        description:
          'Complete supervised clinical training in a hospital setting, rotating through different specialties.',
      },
      midLevel: {
        roles: ['Attending Physician', 'Specialist'],
        experience: '5-10 years',
        description:
          'Practice independently, treat patients, and may supervise residents and medical students.',
      },
      seniorLevel: {
        roles: ['Senior Physician', 'Department Head'],
        experience: '10-20 years',
        description:
          'Lead medical teams, develop treatment protocols, and contribute to medical research.',
      },
      executiveLevel: {
        roles: ['Chief Medical Officer', 'Medical Director'],
        experience: '20+ years',
        description:
          'Set medical policy, oversee clinical operations, and ensure quality of care across the organization.',
      },
    },
    certifications: [
      {
        name: 'Board Certification',
        provider: 'American Board of Medical Specialties',
        description:
          'Validates expertise in a medical specialty through rigorous examination.',
      },
      {
        name: 'Advanced Cardiac Life Support (ACLS)',
        provider: 'American Heart Association',
        description: 'Certifies ability to manage cardiovascular emergencies.',
      },
    ],
    industryTrends: [
      'Telemedicine',
      'Precision Medicine',
      'AI in Diagnostics',
      'Value-Based Care',
    ],
    featured: true,
    views: 0,
    saves: 0,
  },
  {
    title: 'Registered Nurse',
    category: 'Healthcare',
    tier: 'PREMIUM',
    performanceLevel: 'GOOD',
    academicRequirementScore: 9, // B- grade = 9 points
    description:
      'Provide and coordinate patient care, educate patients about health conditions, and provide advice and emotional support to patients and their families.',
    keySubjects: ['Biology', 'Chemistry', 'Psychology', 'Anatomy'],
    requiredGrades: {},
    minimumMeanGrade: 'B-',
    marketDemand: 'Very High',
    jobProspects: [
      'Hospitals',
      'Clinics',
      'Schools',
      'Home Health Agencies',
      'Long-term Care Facilities',
    ],
    salary: {
      entry: '35000',
      mid: '60000',
      senior: '90000',
    },
    institutions: [], // Will be populated later
    programDuration: '3-4 years',
    skillsRequired: [
      'Patient Care',
      'Clinical Procedures',
      'Medical Documentation',
      'Critical Thinking',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Staff Nurse', 'Graduate Nurse'],
        experience: '0-2 years',
        description:
          'Provide direct patient care, administer medications, and assist with medical procedures.',
      },
      midLevel: {
        roles: ['Charge Nurse', 'Specialized Nurse'],
        experience: '3-7 years',
        description:
          'Oversee nursing units, coordinate patient care, and specialize in specific areas of medicine.',
      },
      seniorLevel: {
        roles: ['Nurse Manager', 'Clinical Nurse Specialist'],
        experience: '8-15 years',
        description:
          'Manage nursing staff, develop care protocols, and serve as clinical experts.',
      },
      executiveLevel: {
        roles: ['Chief Nursing Officer', 'Director of Nursing'],
        experience: '15+ years',
        description:
          'Set nursing strategy, oversee nursing operations, and ensure quality of care across the organization.',
      },
    },
    certifications: [
      {
        name: 'Basic Life Support (BLS)',
        provider: 'American Heart Association',
        description:
          'Certifies ability to perform CPR and manage choking emergencies.',
      },
      {
        name: 'Certified Critical Care Nurse (CCRN)',
        provider: 'American Association of Critical-Care Nurses',
        description: 'Validates expertise in critical care nursing.',
      },
    ],
    industryTrends: [
      'Telehealth Nursing',
      'Specialized Care',
      'Evidence-Based Practice',
      'Nurse Practitioners',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Pharmacist',
    category: 'Healthcare',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 11, // B+ grade = 11 points
    description:
      'Dispense prescription medications, advise patients on proper medication use, and monitor drug interactions to ensure safe and effective treatment.',
    keySubjects: ['Chemistry', 'Biology', 'Pharmacology', 'Mathematics'],
    requiredGrades: {},
    minimumMeanGrade: 'B+',
    marketDemand: 'High',
    jobProspects: [
      'Retail Pharmacies',
      'Hospitals',
      'Pharmaceutical Companies',
      'Government Agencies',
      'Research Institutions',
    ],
    salary: {
      entry: '80000',
      mid: '110000',
      senior: '140000',
    },
    institutions: [], // Will be populated later
    programDuration: '6 years',
    skillsRequired: [
      'Pharmaceutical Knowledge',
      'Patient Counseling',
      'Medication Management',
      'Attention to Detail',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Staff Pharmacist', 'Pharmacy Resident'],
        experience: '0-3 years',
        description:
          'Dispense medications, counsel patients, and ensure prescription accuracy.',
      },
      midLevel: {
        roles: ['Clinical Pharmacist', 'Pharmacy Manager'],
        experience: '4-8 years',
        description:
          'Provide specialized medication therapy, manage pharmacy operations, and collaborate with healthcare teams.',
      },
      seniorLevel: {
        roles: ['Senior Pharmacist', 'Pharmacy Director'],
        experience: '8-15 years',
        description:
          'Oversee pharmacy departments, develop medication protocols, and ensure regulatory compliance.',
      },
      executiveLevel: {
        roles: ['Chief Pharmacy Officer', 'VP of Pharmacy Services'],
        experience: '15+ years',
        description:
          'Set pharmacy strategy, manage multiple departments, and drive pharmaceutical innovation.',
      },
    },
    certifications: [
      {
        name: 'Board Certified Pharmacotherapy Specialist (BCPS)',
        provider: 'Board of Pharmacy Specialties',
        description:
          'Validates expertise in optimizing medication therapy and improving patient outcomes.',
      },
      {
        name: 'Certified Diabetes Educator (CDE)',
        provider: 'National Certification Board for Diabetes Educators',
        description:
          'Certifies ability to educate and support people with diabetes.',
      },
    ],
    industryTrends: [
      'Medication Therapy Management',
      'Pharmacogenomics',
      'Telepharmacy',
      'Specialty Pharmaceuticals',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Physical Therapist',
    category: 'Healthcare',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 10, // B grade = 10 points
    description:
      'Help injured or ill people improve movement and manage pain through exercises, stretches, hands-on therapy, and patient education to enhance physical function and mobility.',
    keySubjects: ['Anatomy', 'Physiology', 'Kinesiology', 'Biology'],
    requiredGrades: {},
    minimumMeanGrade: 'B',
    marketDemand: 'High',
    jobProspects: [
      'Hospitals',
      'Outpatient Clinics',
      'Sports Teams',
      'Schools',
      'Home Health Services',
    ],
    salary: {
      entry: '65000',
      mid: '85000',
      senior: '110000',
    },
    institutions: [], // Will be populated later
    programDuration: '3 years (DPT)',
    skillsRequired: [
      'Manual Therapy',
      'Exercise Prescription',
      'Patient Assessment',
      'Rehabilitation Techniques',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Staff Physical Therapist', 'Rehabilitation Specialist'],
        experience: '0-3 years',
        description:
          'Provide direct patient care, implement treatment plans, and document patient progress.',
      },
      midLevel: {
        roles: ['Senior Physical Therapist', 'Clinical Specialist'],
        experience: '4-8 years',
        description:
          'Develop specialized treatment approaches, mentor junior therapists, and manage complex cases.',
      },
      seniorLevel: {
        roles: ['Lead Physical Therapist', 'Clinic Director'],
        experience: '8-15 years',
        description:
          'Oversee therapy departments, develop clinical protocols, and ensure quality of care.',
      },
      executiveLevel: {
        roles: ['Director of Rehabilitation', 'Chief Clinical Officer'],
        experience: '15+ years',
        description:
          'Set therapy strategy, manage multiple departments, and drive clinical innovation.',
      },
    },
    certifications: [
      {
        name: 'Orthopedic Certified Specialist (OCS)',
        provider: 'American Board of Physical Therapy Specialties',
        description: 'Validates expertise in orthopedic physical therapy.',
      },
      {
        name: 'Certified Hand Therapist (CHT)',
        provider: 'Hand Therapy Certification Commission',
        description:
          'Certifies specialized knowledge in upper extremity rehabilitation.',
      },
    ],
    industryTrends: [
      'Telerehabilitation',
      'Wearable Technology',
      'Preventive Care',
      'Specialized Therapy',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
  {
    title: 'Dentist',
    category: 'Healthcare',
    tier: 'ELITE',
    performanceLevel: 'EXCELLENT',
    academicRequirementScore: 11, // A- grade = 11 points
    description:
      "Diagnose and treat problems with patients' teeth, gums, and related parts of the mouth, providing advice and instruction on taking care of teeth and gums to prevent future problems.",
    keySubjects: ['Biology', 'Chemistry', 'Anatomy', 'Physics'],
    requiredGrades: {},
    minimumMeanGrade: 'A-',
    marketDemand: 'High',
    jobProspects: [
      'Private Practice',
      'Dental Clinics',
      'Hospitals',
      'Public Health Services',
      'Research Institutions',
    ],
    salary: {
      entry: '100000',
      mid: '150000',
      senior: '200000',
    },
    institutions: [], // Will be populated later
    programDuration: '4 years (after undergraduate)',
    skillsRequired: [
      'Clinical Skills',
      'Manual Dexterity',
      'Patient Management',
      'Diagnostic Ability',
      'Communication',
    ],
    careerPath: {
      entryLevel: {
        roles: ['Associate Dentist', 'General Dentist'],
        experience: '0-3 years',
        description:
          'Perform routine dental procedures, diagnose oral conditions, and develop treatment plans.',
      },
      midLevel: {
        roles: ['Established Dentist', 'Specialist'],
        experience: '4-10 years',
        description:
          'Manage complex cases, perform specialized procedures, and may own a dental practice.',
      },
      seniorLevel: {
        roles: ['Senior Dentist', 'Practice Owner'],
        experience: '10-20 years',
        description:
          'Lead dental teams, develop treatment protocols, and manage business operations.',
      },
      executiveLevel: {
        roles: ['Dental Director', 'Chief Dental Officer'],
        experience: '20+ years',
        description:
          'Set dental policy, oversee multiple practices, and ensure quality of care across the organization.',
      },
    },
    certifications: [
      {
        name: 'Board Certification in Dental Specialty',
        provider: 'American Board of Dental Specialties',
        description:
          'Validates expertise in a dental specialty through rigorous examination.',
      },
      {
        name: 'Advanced Cardiac Life Support (ACLS)',
        provider: 'American Heart Association',
        description:
          'Certifies ability to manage cardiovascular emergencies in dental settings.',
      },
    ],
    industryTrends: [
      'Digital Dentistry',
      '3D Printing',
      'Minimally Invasive Techniques',
      'Cosmetic Dentistry',
    ],
    featured: false,
    views: 0,
    saves: 0,
  },
];

export default healthcareCareers;
