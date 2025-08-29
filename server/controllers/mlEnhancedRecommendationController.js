import { callEnhancedMLService } from '../utils/mlHelper.js';
import Recommendation from '../models/Recommendation.js';
import Career from '../models/Career.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { createError } from '../utils/errorHandler.js';

// Helper functions for recommendation calculations
const calculateMatchScore = (kcseResults, career) => {
  let score = 0;
  let maxScore = 0;

  // Convert KCSE grades to points
  const gradePoints = {
    A: 12,
    'A-': 11,
    'B+': 10,
    B: 9,
    'B-': 8,
    'C+': 7,
    C: 6,
    'C-': 5,
    'D+': 4,
    D: 3,
    'D-': 2,
    E: 1,
  };

  // Convert minimum mean grade to points
  const minGradePoints = gradePoints[career.minimumMeanGrade] || 0;

  // Check if mean grade meets minimum requirement
  const meanGradePoints = gradePoints[kcseResults.meanGrade] || 0;
  if (meanGradePoints < minGradePoints) {
    return 0; // Doesn't meet minimum requirements
  }

  // Base score from mean grade match (up to 30%)
  const meanGradeScore = (meanGradePoints / 12) * 30;
  score += meanGradeScore;
  maxScore += 30;

  // Academic requirement score bonus (up to 20%)
  const academicScore = (career.academicRequirementScore / 12) * 20;
  const studentAcademicLevel = (meanGradePoints / 12) * 20;
  const academicFitScore = Math.min(studentAcademicLevel, academicScore);
  score += academicFitScore;
  maxScore += 20;

  // Check subject requirements (up to 30%)
  const subjectMap = {};
  kcseResults.subjects.forEach((subject) => {
    subjectMap[subject.subject.toLowerCase()] = {
      grade: subject.grade,
      points: gradePoints[subject.grade] || 0,
    };
  });

  let subjectScore = 0;
  let requiredSubjectsCount = 0;

  // Check each key subject
  career.keySubjects.forEach((subject) => {
    requiredSubjectsCount++;
    const subjectLower = subject.toLowerCase();

    // Check if student has taken this subject
    if (subjectMap[subjectLower]) {
      // Check required grade if specified
      const requiredGrade =
        career.requiredGrades && career.requiredGrades.get(subject);

      if (requiredGrade) {
        const requiredPoints = gradePoints[requiredGrade] || 0;
        if (subjectMap[subjectLower].points >= requiredPoints) {
          subjectScore += 10; // Full points for meeting specific requirement
        } else {
          subjectScore += 5; // Partial points for taking subject but not meeting grade
        }
      } else {
        // No specific grade required, points based on performance
        subjectScore += (subjectMap[subjectLower].points / 12) * 10;
      }
    }
  });

  // Calculate percentage of subject score
  const subjectPercentage =
    requiredSubjectsCount > 0
      ? (subjectScore / (requiredSubjectsCount * 10)) * 30
      : 0;

  score += subjectPercentage;
  maxScore += 30;

  // Market demand bonus (up to 20%)
  const demandBonus = {
    'Very High': 20,
    High: 15,
    Medium: 10,
    Low: 5,
    Moderate: 8,
  };

  score += demandBonus[career.marketDemand] || 0;
  maxScore += 20;

  // Calculate final percentage
  const finalScore = Math.round((score / maxScore) * 100);

  return finalScore;
};

const generateReasons = (kcseResults, career, match) => {
  const reasons = [];

  // Mean grade reason
  const gradeMap = {
    A: 'excellent',
    'A-': 'excellent',
    'B+': 'very good',
    B: 'good',
    'B-': 'good',
    'C+': 'average',
    C: 'average',
    'C-': 'below average',
    'D+': 'poor',
    D: 'poor',
    'D-': 'poor',
    E: 'poor',
  };

  const performanceLevel = gradeMap[kcseResults.meanGrade] || 'average';

  if (match >= 90) {
    reasons.push(
      `Your ${performanceLevel} overall performance aligns perfectly with this career path.`
    );
  } else if (match >= 75) {
    reasons.push(
      `Your ${performanceLevel} overall performance is well-suited for this career.`
    );
  } else if (match >= 60) {
    reasons.push(
      `Your ${performanceLevel} overall performance meets the requirements for this career.`
    );
  } else {
    reasons.push(
      `Your overall performance meets the minimum requirements for this career.`
    );
  }

  // Subject match reasons
  const subjectMap = {};
  kcseResults.subjects.forEach((subject) => {
    subjectMap[subject.subject.toLowerCase()] = subject.grade;
  });

  const matchedSubjects = [];
  career.keySubjects.forEach((subject) => {
    const subjectLower = subject.toLowerCase();
    if (subjectMap[subjectLower]) {
      matchedSubjects.push(subject);
    }
  });

  if (matchedSubjects.length > 0) {
    if (matchedSubjects.length === career.keySubjects.length) {
      reasons.push(
        `You've studied all the key subjects required for this career: ${matchedSubjects.join(
          ', '
        )}.`
      );
    } else {
      reasons.push(
        `You've studied ${matchedSubjects.length} of ${
          career.keySubjects.length
        } key subjects for this career: ${matchedSubjects.join(', ')}.`
      );
    }
  }

  // Market demand reason
  if (career.marketDemand === 'Very High') {
    reasons.push('This career has very high demand in the current job market.');
  } else if (career.marketDemand === 'High') {
    reasons.push('This career has high demand in the current job market.');
  }

  return reasons;
};

const determineStrengths = (subjects) => {
  const subjectCategories = {
    Mathematics: 'Sciences',
    Physics: 'Sciences',
    Chemistry: 'Sciences',
    Biology: 'Sciences',
    English: 'Languages',
    Kiswahili: 'Languages',
    French: 'Languages',
    German: 'Languages',
    Arabic: 'Languages',
    'History & Government': 'Humanities',
    Geography: 'Humanities',
    'Christian Religious Education': 'Humanities',
    'Islamic Religious Education': 'Humanities',
    'Hindu Religious Education': 'Humanities',
    'Business Studies': 'Commerce',
    Economics: 'Commerce',
    Accounting: 'Commerce',
    'Computer Studies': 'Technical',
    Agriculture: 'Technical',
    'Home Science': 'Technical',
    'Art & Design': 'Creative Arts',
    Music: 'Creative Arts',
  };

  // Group subjects by category and calculate average points
  const categoryPoints = {};
  const categoryCount = {};

  // Grade to points mapping
  const gradePoints = {
    A: 12,
    'A-': 11,
    'B+': 10,
    B: 9,
    'B-': 8,
    'C+': 7,
    C: 6,
    'C-': 5,
    'D+': 4,
    D: 3,
    'D-': 2,
    E: 1,
  };

  subjects.forEach((subject) => {
    const category = subjectCategories[subject.subject] || 'Other';
    const points = gradePoints[subject.grade] || 0;

    if (!categoryPoints[category]) {
      categoryPoints[category] = 0;
      categoryCount[category] = 0;
    }

    categoryPoints[category] += points;
    categoryCount[category]++;
  });

  // Calculate average points per category
  const categoryAverages = {};
  Object.keys(categoryPoints).forEach((category) => {
    categoryAverages[category] =
      categoryPoints[category] / categoryCount[category];
  });

  // Determine top 3 strengths
  const strengths = Object.keys(categoryAverages)
    .sort((a, b) => categoryAverages[b] - categoryAverages[a])
    .slice(0, 3);

  return strengths;
};

const determineStudentPerformance = (kcseResults) => {
  const gradePoints = {
    A: 12,
    'A-': 11,
    'B+': 10,
    B: 9,
    'B-': 8,
    'C+': 7,
    C: 6,
    'C-': 5,
    'D+': 4,
    D: 3,
    'D-': 2,
    E: 1,
  };

  const meanPoints =
    kcseResults.meanPoints || gradePoints[kcseResults.meanGrade] || 0;

  let performanceLevel;
  let eligibleTiers;

  if (meanPoints >= 10) {
    // A- and above
    performanceLevel = 'EXCELLENT';
    // Tightened: exhaust high tiers first; exclude FOUNDATION for top performers
    eligibleTiers = ['ELITE', 'PREMIUM'];
  } else if (meanPoints >= 8) {
    // B- to B+
    performanceLevel = 'GOOD';
    eligibleTiers = ['PREMIUM', 'STANDARD'];
  } else if (meanPoints >= 6) {
    // C to C+
    performanceLevel = 'AVERAGE';
    eligibleTiers = ['STANDARD', 'FOUNDATION'];
  } else {
    // Below C
    performanceLevel = 'BASIC';
    eligibleTiers = ['FOUNDATION'];
  }

  console.log(`[v0] Student Performance Classification:`);
  console.log(`[v0] Mean Points: ${meanPoints}`);
  console.log(`[v0] Performance Level: ${performanceLevel}`);
  console.log(`[v0] Eligible Tiers: ${eligibleTiers.join(', ')}`);

  return { performanceLevel, eligibleTiers, meanPoints };
};

const calculateAcademicFit = (kcseResults, career) => {
  const gradePoints = {
    A: 12,
    'A-': 11,
    'B+': 10,
    B: 9,
    'B-': 8,
    'C+': 7,
    C: 6,
    'C-': 5,
    'D+': 4,
    D: 3,
    'D-': 2,
    E: 1,
  };

  const studentPoints = gradePoints[kcseResults.meanGrade] || 0;
  const careerRequirement = career.academicRequirementScore || 6;

  // Calculate fit as percentage - higher student performance relative to requirement
  const fitPercentage = Math.min(
    100,
    Math.round((studentPoints / careerRequirement) * 100)
  );

  return fitPercentage;
};

// Performance-aware recommendation generation
export const generatePerformanceAwareRecommendations = async (
  req,
  res,
  next
) => {
  try {
    const resultsData =
      req.body.results?.results || req.body.results || req.body;
    const { year, subjects, meanGrade, meanPoints } = resultsData;

    console.log(`[v0] Processing KCSE Results:`);
    console.log(`[v0] Mean Grade: ${meanGrade}`);
    console.log(`[v0] Mean Points: ${meanPoints}`);
    console.log(`[v0] Subjects Count: ${subjects?.length}`);

    if (!subjects || !Array.isArray(subjects) || subjects.length < 7) {
      return next(
        createError('Please provide at least 7 subjects with grades', 400)
      );
    }

    let studentPerformance = determineStudentPerformance({
      meanGrade,
      meanPoints,
      subjects,
    });

    console.log(`[v0] Initial Student Performance:`, studentPerformance);

    // Get all careers from database
    const careers = await Career.find();

    // Generate rule-based recommendations first
    const ruleBasedRecommendations = [];

    for (const career of careers) {
      const match = calculateMatchScore(
        { year, subjects, meanGrade, meanPoints },
        career
      );

      const performanceMatch = studentPerformance.eligibleTiers.includes(
        career.tier
      );
      const academicFit = calculateAcademicFit({ meanGrade, subjects }, career);

      if (match >= 50 && performanceMatch) {
        ruleBasedRecommendations.push({
          id: career._id,
          title: career.title,
          match,
          category: career.category,
          description: career.description,
          keySubjects: career.keySubjects,
          minimumMeanGrade: career.minimumMeanGrade,
          marketDemand: career.marketDemand,
          salary: career.salary,
          tier: career.tier,
          performanceLevel: career.performanceLevel,
          performanceMatch,
          academicFit,
          reasons: generateReasons(
            { year, subjects, meanGrade, meanPoints },
            career,
            match
          ),
        });
      }
    }

    // Tier-aware ordering: exhaust higher tiers before lower ones, then by match
    const tierPriority = { ELITE: 4, PREMIUM: 3, STANDARD: 2, FOUNDATION: 1 };
    ruleBasedRecommendations.sort((a, b) => {
      const ta = tierPriority[a.tier] || 0;
      const tb = tierPriority[b.tier] || 0;
      if (tb !== ta) return tb - ta;
      return (b.match || 0) - (a.match || 0);
    });

    // Apply performance-aware ML enhancement
    let enhancedRecommendations = ruleBasedRecommendations;
    let mlEnhanced = false;
    let performanceFiltered = false;
    let recommendationsSummary = null;

    if (req.user) {
      try {
        const user = await User.findById(req.user._id);

        console.log('[v0] Calling enhanced ML service with user data:', {
          meanGrade: user.kcseResults?.meanGrade,
          meanPoints: user.kcseResults?.meanPoints,
          recommendationsCount: ruleBasedRecommendations.length,
        });

        // Call enhanced ML service with performance filtering
        const mlResult = await callEnhancedMLService(
          'enhance_recommendations',
          {
            user: {
              ...user.toObject(),
              kcseResults: { year, meanGrade, meanPoints, subjects },
            },
            recommendations: ruleBasedRecommendations.slice(0, 25), // Top 25 for ML processing
            studentPerformance,
          }
        );

        console.log(`[v0] ML Service Result:`);
        console.log(`[v0] Success: ${mlResult.success}`);
        console.log(
          `[v0] Performance Filtering Applied: ${mlResult.performance_filtering_applied}`
        );
        console.log(
          `[v0] Student Performance from ML: ${JSON.stringify(
            mlResult.student_performance
          )}`
        );

        if (mlResult.success) {
          enhancedRecommendations =
            mlResult.enhanced_recommendations || ruleBasedRecommendations;
          mlEnhanced = mlResult.ml_enhanced || false;
          performanceFiltered = mlResult.performance_filtering_applied || false;
          recommendationsSummary = mlResult.recommendations_summary;

          if (mlResult.student_performance) {
            studentPerformance = {
              performanceLevel: mlResult.student_performance.level || 'AVERAGE',
              eligibleTiers: mlResult.student_performance.eligible_tiers || [
                'STANDARD',
                'FOUNDATION',
              ],
              meanPoints:
                mlResult.student_performance.mean_points || meanPoints,
              strengths: mlResult.student_performance.strengths || [],
            };

            console.log(
              `[v0] Updated Student Performance from ML:`,
              studentPerformance
            );
          }
        }

        // Log ML enhancement with performance details
        await Activity.create({
          user: req.user._id,
          action: 'performance_aware_recommendations',
          details: {
            original_count: ruleBasedRecommendations.length,
            enhanced_count: enhancedRecommendations.length,
            ml_enhanced: mlEnhanced,
            performance_filtered: performanceFiltered,
            performance_level: studentPerformance.performanceLevel,
            eligible_tiers: studentPerformance.eligibleTiers,
          },
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        });
      } catch (mlError) {
        console.error(
          'ML Enhancement failed, falling back to rule-based:',
          mlError
        );
      }
    }

    if (req.user) {
      const user = await User.findById(req.user._id);
      user.kcseResults = { year, meanGrade, meanPoints, subjects };
      await user.save();

      const performanceInsights = {
        message: generatePerformanceMessage(
          studentPerformance.performanceLevel
        ),
        motivationalQuote: generateMotivationalQuote(
          studentPerformance.performanceLevel
        ),
        nextSteps: generateNextSteps(
          studentPerformance.performanceLevel,
          studentPerformance.eligibleTiers
        ),
        improvementAreas: generateImprovementAreas(
          subjects,
          studentPerformance.performanceLevel
        ),
      };

      await Recommendation.create({
        user: req.user._id,
        kcseResults: { year, meanGrade, meanPoints, subjects },
        strengths: determineStrengths(subjects),
        performanceLevel: studentPerformance.performanceLevel,
        eligibleTiers: studentPerformance.eligibleTiers,
        performanceInsights,
        recommendations: enhancedRecommendations.slice(0, 12).map((rec) => ({
          career: rec.id,
          match: rec.ml_enhanced_score || rec.match,
          reasons: [...(rec.reasons || []), ...(rec.ml_reasons || [])],
          mlEnhanced: !!rec.ml_enhanced_score,
          mlScore: rec.ml_enhanced_score || rec.match,
          successProbability: rec.success_probability || 0.7,
          mlConfidence: rec.ml_confidence || 75,
          improvementSuggestions: rec.improvement_suggestions || [],
          tier: rec.tier,
          performanceMatch: rec.performanceMatch,
          academicFit: rec.academicFit,
        })),
      });
    }

    // Populate career details for response (already tier-prioritized)
    const populatedRecommendations = [];
    for (const rec of enhancedRecommendations.slice(0, 12)) {
      const career = await Career.findById(rec.id).populate(
        'institutions',
        'name type location.city logo'
      );

      populatedRecommendations.push({
        ...rec,
        institutions: career.institutions,
        jobProspects: career.jobProspects,
        improvementSuggestions: rec.improvement_suggestions || [],
      });
    }

    const performanceInsights = generateEnhancedPerformanceInsights(
      { meanGrade, meanPoints, subjects },
      studentPerformance,
      populatedRecommendations
    );

    res.status(200).json({
      success: true,
      mlEnhanced: mlEnhanced,
      performanceFiltered: performanceFiltered,
      studentInfo: {
        meanGrade,
        meanPoints,
        strengths: determineStrengths(subjects),
        performanceLevel: studentPerformance.performanceLevel,
        eligibleTiers: studentPerformance.eligibleTiers,
      },
      recommendations: populatedRecommendations,
      performanceInsights,
      recommendationsSummary,
    });
  } catch (error) {
    next(error);
  }
};

// Get performance-appropriate careers
export const getPerformanceAppropriateCareers = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(createError('Authentication required', 401));
    }

    const user = await User.findById(req.user._id);
    const { limit = 20 } = req.query;

    const mlResult = await callEnhancedMLService('get_appropriate_careers', {
      user: user.toObject(),
      limit: Number.parseInt(limit),
    });

    if (mlResult.success) {
      // Populate career details
      const careerIds = mlResult.careers.map((c) => c.id || c._id);
      const careers = await Career.find({ _id: { $in: careerIds } }).populate(
        'institutions',
        'name type location.city logo'
      );

      const enrichedCareers = mlResult.careers.map((mlCareer) => {
        const careerData = careers.find(
          (c) => c._id.toString() === (mlCareer.id || mlCareer._id)
        );
        return {
          ...careerData?.toObject(),
          tier: mlCareer.tier,
          tier_description: mlCareer.tier_description,
          performance_match: mlCareer.performance_match,
        };
      });

      res.status(200).json({
        success: true,
        careers: enrichedCareers,
        studentPerformance: mlResult.student_performance,
        totalAppropriateCareers: mlResult.total_appropriate_careers,
      });
    } else {
      throw new Error(mlResult.error || 'Failed to get appropriate careers');
    }
  } catch (error) {
    next(error);
  }
};

// Enhanced recommendation generation with ML (original function)
export const generateMLEnhancedRecommendations = async (req, res, next) => {
  try {
    // Fix the nested results issue
    const resultsData =
      req.body.results?.results || req.body.results || req.body;
    const { year, subjects, meanGrade, meanPoints } = resultsData;

    if (!subjects || !Array.isArray(subjects) || subjects.length < 7) {
      return next(
        createError('Please provide at least 7 subjects with grades', 400)
      );
    }

    // First, get rule-based recommendations using your existing logic
    const careers = await Career.find();
    const ruleBasedRecommendations = [];

    // Use your existing calculateMatchScore logic
    for (const career of careers) {
      const match = calculateMatchScore(
        { year, subjects, meanGrade, meanPoints },
        career
      );

      if (match >= 50) {
        ruleBasedRecommendations.push({
          id: career._id,
          title: career.title,
          match,
          category: career.category,
          description: career.description,
          keySubjects: career.keySubjects,
          minimumMeanGrade: career.minimumMeanGrade,
          marketDemand: career.marketDemand,
          salary: career.salary,
          reasons: generateReasons(
            { year, subjects, meanGrade, meanPoints },
            career,
            match
          ),
        });
      }
    }

    // Sort by match score
    ruleBasedRecommendations.sort((a, b) => b.match - a.match);

    // Enhance with ML if user is authenticated
    let enhancedRecommendations = ruleBasedRecommendations;
    let mlEnhanced = false;

    if (req.user) {
      try {
        const user = await User.findById(req.user._id);

        console.log('[v0] Calling enhanced ML service with user data:', {
          meanGrade: user.kcseResults?.meanGrade,
          meanPoints: user.kcseResults?.meanPoints,
          recommendationsCount: ruleBasedRecommendations.length,
        });

        const mlResult = await callEnhancedMLService(
          'enhance_recommendations',
          {
            user: user.toObject(),
            recommendations: ruleBasedRecommendations.slice(0, 20), // Top 20 for ML processing
          }
        );

        console.log('[v0] ML service response:', {
          success: mlResult.success,
          performanceLevel: mlResult.student_performance?.level,
          eligibleTiers: mlResult.student_performance?.eligible_tiers,
          enhancedRecommendationsCount:
            mlResult.enhanced_recommendations?.length,
        });

        if (mlResult.success) {
          enhancedRecommendations =
            mlResult.enhanced_recommendations || ruleBasedRecommendations;
          mlEnhanced = mlResult.ml_enhanced || false;
        }

        // Log ML enhancement
        await Activity.create({
          user: req.user._id,
          action: 'ml_enhanced_recommendations',
          details: {
            original_count: ruleBasedRecommendations.length,
            enhanced_count: enhancedRecommendations.length,
            ml_enhanced: mlEnhanced,
          },
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        });
      } catch (mlError) {
        console.error(
          'ML Enhancement failed, falling back to rule-based:',
          mlError
        );
        // Continue with rule-based recommendations if ML fails
      }
    }

    // Save recommendation record and populate career details
    if (req.user) {
      // Save KCSE results to user profile
      const user = await User.findById(req.user._id);
      user.kcseResults = { year, meanGrade, meanPoints, subjects };
      await user.save();

      // Create recommendation record with ML enhancement flag
      await Recommendation.create({
        user: req.user._id,
        kcseResults: { year, meanGrade, meanPoints, subjects },
        strengths: determineStrengths(subjects),
        recommendations: enhancedRecommendations.slice(0, 10).map((rec) => ({
          career: rec.id,
          match: rec.ml_enhanced_score || rec.match,
          reasons: [...(rec.reasons || []), ...(rec.ml_reasons || [])],
          mlEnhanced: !!rec.ml_enhanced_score,
          improvementSuggestions: rec.improvement_suggestions || [],
        })),
      });
    }

    // Populate career details for response
    const populatedRecommendations = [];
    for (const rec of enhancedRecommendations.slice(0, 10)) {
      const career = await Career.findById(rec.id).populate(
        'institutions',
        'name type location.city logo'
      );

      populatedRecommendations.push({
        ...rec,
        institutions: career.institutions,
        jobProspects: career.jobProspects,
        improvementSuggestions: rec.improvement_suggestions || [],
      });
    }

    res.status(200).json({
      success: true,
      mlEnhanced: mlEnhanced,
      studentInfo: {
        meanGrade,
        meanPoints,
        strengths: determineStrengths(subjects),
      },
      recommendations: populatedRecommendations,
    });
  } catch (error) {
    next(error);
  }
};

// Update ML-enhanced recommendations
export const updateMLEnhancedRecommendations = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultsData =
      req.body.results?.results || req.body.results || req.body;
    const { year, subjects, meanGrade, meanPoints } = resultsData;

    if (!subjects || !Array.isArray(subjects) || subjects.length < 7) {
      return next(
        createError('Please provide at least 7 subjects with grades', 400)
      );
    }

    // Find existing recommendation
    let existingRecommendation;
    if (id === 'current') {
      existingRecommendation = await Recommendation.findOne({
        user: req.user._id,
      }).sort({ createdAt: -1 });
    } else {
      existingRecommendation = await Recommendation.findById(id);
    }

    if (!existingRecommendation) {
      return next(createError('Recommendation not found', 404));
    }

    // Generate new recommendations using the same logic as create
    const careers = await Career.find();
    const ruleBasedRecommendations = [];

    for (const career of careers) {
      const match = calculateMatchScore(
        { year, subjects, meanGrade, meanPoints },
        career
      );

      const performanceMatch = determineStudentPerformance({
        meanGrade,
        subjects,
      }).eligibleTiers.includes(career.tier);
      const academicFit = calculateAcademicFit({ meanGrade, subjects }, career);

      if (match >= 50 && performanceMatch) {
        ruleBasedRecommendations.push({
          id: career._id,
          title: career.title,
          match,
          category: career.category,
          description: career.description,
          keySubjects: career.keySubjects,
          minimumMeanGrade: career.minimumMeanGrade,
          marketDemand: career.marketDemand,
          salary: career.salary,
          tier: career.tier,
          performanceLevel: career.performanceLevel,
          performanceMatch,
          academicFit,
          reasons: generateReasons(
            { year, subjects, meanGrade, meanPoints },
            career,
            match
          ),
        });
      }
    }

    // Sort by match score
    ruleBasedRecommendations.sort((a, b) => b.match - a.match);

    let enhancedRecommendations = ruleBasedRecommendations;
    let mlEnhanced = false;
    let performanceFiltered = false;
    let recommendationsSummary = null;

    try {
      const user = await User.findById(req.user._id);

      console.log('[v0] Calling enhanced ML service with user data:', {
        meanGrade: user.kcseResults?.meanGrade,
        meanPoints: user.kcseResults?.meanPoints,
        recommendationsCount: ruleBasedRecommendations.length,
      });

      // Call enhanced ML service with performance filtering
      const mlResult = await callEnhancedMLService('enhance_recommendations', {
        user: {
          ...user.toObject(),
          kcseResults: { year, meanGrade, meanPoints, subjects },
        },
        recommendations: ruleBasedRecommendations.slice(0, 25), // Top 25 for ML processing
        studentPerformance: determineStudentPerformance({
          meanGrade,
          subjects,
        }),
      });

      console.log('[v0] ML service response:', {
        success: mlResult.success,
        performanceLevel: mlResult.student_performance?.level,
        eligibleTiers: mlResult.student_performance?.eligible_tiers,
        enhancedRecommendationsCount: mlResult.enhanced_recommendations?.length,
      });

      if (mlResult.success) {
        enhancedRecommendations =
          mlResult.enhanced_recommendations || ruleBasedRecommendations;
        mlEnhanced = mlResult.ml_enhanced || false;
        performanceFiltered = mlResult.performance_filtering_applied || false;
        recommendationsSummary = mlResult.recommendations_summary;

        if (mlResult.student_performance) {
          const updatedStudentPerformance = {
            performanceLevel: mlResult.student_performance.level || 'AVERAGE',
            eligibleTiers: mlResult.student_performance.eligible_tiers || [
              'STANDARD',
              'FOUNDATION',
            ],
            meanPoints: mlResult.student_performance.mean_points || meanPoints,
            strengths: mlResult.student_performance.strengths || [],
          };
          existingRecommendation.studentPerformance = updatedStudentPerformance;
        }
      }

      // Log ML enhancement with performance details
      await Activity.create({
        user: req.user._id,
        action: 'update_performance_aware_recommendations',
        details: {
          original_count: ruleBasedRecommendations.length,
          enhanced_count: enhancedRecommendations.length,
          ml_enhanced: mlEnhanced,
          performance_filtered: performanceFiltered,
          performance_level: determineStudentPerformance({
            meanGrade,
            subjects,
          }).performanceLevel,
          eligible_tiers: determineStudentPerformance({ meanGrade, subjects })
            .eligibleTiers,
        },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    } catch (mlError) {
      console.error('ML Enhancement failed during update:', mlError);
    }

    // Update user's KCSE results
    const user = await User.findById(req.user._id);
    user.kcseResults = { year, meanGrade, meanPoints, subjects };
    await user.save();

    existingRecommendation.kcseResults = {
      year,
      meanGrade,
      meanPoints,
      subjects,
    };
    existingRecommendation.strengths = determineStrengths(subjects);
    existingRecommendation.performanceLevel = determineStudentPerformance({
      meanGrade,
      subjects,
    }).performanceLevel;
    existingRecommendation.eligibleTiers = determineStudentPerformance({
      meanGrade,
      subjects,
    }).eligibleTiers;
    existingRecommendation.recommendations = enhancedRecommendations
      .slice(0, 12)
      .map((rec) => ({
        career: rec.id,
        match: rec.ml_enhanced_score || rec.match,
        reasons: [...(rec.reasons || []), ...(rec.ml_reasons || [])],
        mlEnhanced: !!rec.ml_enhanced_score,
        mlScore: rec.ml_enhanced_score || rec.match,
        successProbability: rec.success_probability || 0.7,
        mlConfidence: rec.ml_confidence || 75,
        improvementSuggestions: rec.improvement_suggestions || [],
        tier: rec.tier,
        performanceMatch: rec.performanceMatch,
        academicFit: rec.academicFit,
      }));
    existingRecommendation.updatedAt = new Date();

    await existingRecommendation.save();

    // Populate career details for response
    const populatedRecommendations = [];
    for (const rec of enhancedRecommendations.slice(0, 12)) {
      const career = await Career.findById(rec.id).populate(
        'institutions',
        'name type location.city logo'
      );

      populatedRecommendations.push({
        ...rec,
        institutions: career.institutions,
        jobProspects: career.jobProspects,
        improvementSuggestions: rec.improvement_suggestions || [],
      });
    }

    const performanceInsights = generateEnhancedPerformanceInsights(
      { meanGrade, meanPoints, subjects },
      determineStudentPerformance({ meanGrade, subjects }),
      populatedRecommendations
    );

    res.status(200).json({
      success: true,
      mlEnhanced: mlEnhanced,
      performanceFiltered: performanceFiltered,
      updated: true,
      studentInfo: {
        meanGrade,
        meanPoints,
        strengths: determineStrengths(subjects),
        performanceLevel: determineStudentPerformance({ meanGrade, subjects })
          .performanceLevel,
        eligibleTiers: determineStudentPerformance({ meanGrade, subjects })
          .eligibleTiers,
      },
      recommendations: populatedRecommendations,
      performanceInsights,
      recommendationsSummary,
    });
  } catch (error) {
    next(error);
  }
};

// Get ML-based similar careers
export const getSimilarCareers = async (req, res, next) => {
  try {
    const { careerId } = req.params;
    const { limit = 5 } = req.query;

    const mlResult = await callEnhancedMLService('get_similar_careers', {
      career_id: careerId,
      n_similar: Number.parseInt(limit),
    });

    if (
      mlResult.success &&
      mlResult.similar_careers &&
      mlResult.similar_careers.length > 0
    ) {
      const similarCareerIds = mlResult.similar_careers.map(
        (sc) => sc.career_id
      );

      // Populate career details
      const similarCareers = await Career.find({
        _id: { $in: similarCareerIds },
      }).populate('institutions', 'name type location.city logo');

      // Combine ML scores with career data
      const enrichedSimilarCareers = similarCareers.map((career) => {
        const mlData = mlResult.similar_careers.find(
          (sc) => sc.career_id === career._id.toString()
        );
        return {
          ...career.toObject(),
          similarity_score: mlData?.similarity_score || 0,
        };
      });

      res.status(200).json({
        success: true,
        data: enrichedSimilarCareers,
      });
    } else {
      // Fallback to category-based similarity
      const career = await Career.findById(careerId);
      const similarCareers = await Career.find({
        category: career.category,
        _id: { $ne: career._id },
      }).limit(Number.parseInt(limit) || 5);

      res.status(200).json({
        success: true,
        data: similarCareers,
        fallback: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get career trends using ML
export const getCareerTrends = async (req, res, next) => {
  try {
    // Get historical recommendation data
    const historicalData = await Recommendation.find({
      createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }, // Last year
    }).populate('recommendations.career', 'title category');

    const mlResult = await callEnhancedMLService('predict_trends', {
      historical_data: historicalData,
    });

    if (mlResult.success) {
      // Populate career details for trends
      const trendCareerIds = mlResult.trends.map((t) => t.career_id);
      const careers = await Career.find({ _id: { $in: trendCareerIds } });

      const enrichedTrends = mlResult.trends
        .map((trend) => {
          const career = careers.find(
            (c) => c._id.toString() === trend.career_id
          );
          return {
            ...trend,
            career: career
              ? {
                  title: career.title,
                  category: career.category,
                  marketDemand: career.marketDemand,
                }
              : null,
          };
        })
        .filter((t) => t.career); // Remove trends for careers that don't exist

      res.status(200).json({
        success: true,
        trends: enrichedTrends,
      });
    } else {
      res.status(200).json({
        success: true,
        trends: [],
        message: 'No trend data available',
      });
    }
  } catch (error) {
    next(error);
  }
};

// ML System health check
export const getMLSystemHealth = async (req, res, next) => {
  try {
    const healthResult = await callEnhancedMLService('health_check');
    res.status(200).json({
      success: true,
      ...healthResult,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      healthy: false,
      status: 'unavailable',
      error: error.message,
    });
  }
};

const generatePerformanceMessage = (performanceLevel) => {
  const messages = {
    EXCELLENT:
      "Outstanding academic performance! You're eligible for the most competitive career paths and top-tier institutions.",
    GOOD: 'Strong academic performance! You have access to many professional career opportunities across multiple sectors.',
    AVERAGE:
      'Solid academic foundation! You have good career options with potential for growth and specialization.',
    BASIC:
      'You have foundational skills that can be developed further. Focus on practical career paths with growth potential.',
  };
  return messages[performanceLevel] || messages.AVERAGE;
};

const generateMotivationalQuote = (performanceLevel) => {
  const quotes = {
    EXCELLENT:
      "Excellence is not a skill, it's an attitude. Your dedication has opened doors to unlimited possibilities.",
    GOOD: 'Success is the sum of small efforts repeated day in and day out. Your consistent performance shows great potential.',
    AVERAGE:
      'Every expert was once a beginner. Your foundation is solid - build upon it with determination.',
    BASIC:
      'The journey of a thousand miles begins with one step. Your potential is unlimited with the right guidance.',
  };
  return quotes[performanceLevel] || quotes.AVERAGE;
};

const generateNextSteps = (performanceLevel, eligibleTiers) => {
  const baseSteps = {
    EXCELLENT: [
      'Apply to top-tier universities and competitive programs',
      'Consider leadership roles and extracurricular activities',
      'Explore research opportunities and internships',
      'Network with professionals in your field of interest',
    ],
    GOOD: [
      'Research university and college programs in your preferred fields',
      'Consider internships or mentorship programs',
      'Develop specialized skills in your areas of interest',
      'Join professional associations or clubs',
    ],
    AVERAGE: [
      'Explore both university and college programs',
      'Consider gaining practical experience through attachments',
      'Focus on continuous skill development',
      'Look into certification programs',
    ],
    BASIC: [
      'Consider additional training or certification courses',
      'Look into apprenticeship programs',
      'Focus on developing marketable skills',
      'Explore vocational and technical training options',
    ],
  };

  return baseSteps[performanceLevel] || baseSteps.AVERAGE;
};

const generateImprovementAreas = (subjects, performanceLevel) => {
  const gradePoints = {
    A: 12,
    'A-': 11,
    'B+': 10,
    B: 9,
    'B-': 8,
    'C+': 7,
    C: 6,
    'C-': 5,
    'D+': 4,
    D: 3,
    'D-': 2,
    E: 1,
  };

  // Find subjects with lower grades
  const weakSubjects = subjects
    .filter((subject) => gradePoints[subject.grade] <= 6)
    .map((subject) => subject.subject)
    .slice(0, 3); // Top 3 areas for improvement

  const improvementAreas = [];

  if (weakSubjects.length > 0) {
    improvementAreas.push(
      `Consider additional support in: ${weakSubjects.join(', ')}`
    );
  }

  if (performanceLevel === 'BASIC') {
    improvementAreas.push('Focus on foundational skills development');
    improvementAreas.push('Consider remedial courses if needed');
  } else if (performanceLevel === 'AVERAGE') {
    improvementAreas.push('Strengthen core subject understanding');
    improvementAreas.push('Develop better study strategies');
  }

  return improvementAreas;
};

// Generate performance insights for frontend display
const generateEnhancedPerformanceInsights = (
  kcseResults,
  studentPerformance,
  recommendations
) => {
  const insights = {
    performanceLevel: studentPerformance.performanceLevel,
    meanPoints: kcseResults.meanPoints,
    eligibleTiers: studentPerformance.eligibleTiers,
    strengthAreas: determineStrengths(kcseResults.subjects),
    recommendations: {
      totalShown: recommendations.length,
      byTier: {},
    },
    motivationalMessage: generatePerformanceMessage(
      studentPerformance.performanceLevel
    ),
    nextSteps: generateNextSteps(
      studentPerformance.performanceLevel,
      studentPerformance.eligibleTiers
    ),
    improvementAreas: generateImprovementAreas(
      kcseResults.subjects,
      studentPerformance.performanceLevel
    ),
  };

  // Count recommendations by tier
  recommendations.forEach((rec) => {
    const tier = rec.tier || 'STANDARD';
    insights.recommendations.byTier[tier] =
      (insights.recommendations.byTier[tier] || 0) + 1;
  });

  return insights;
};
