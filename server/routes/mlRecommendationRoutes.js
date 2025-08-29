import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  generateMLEnhancedRecommendations,
  generatePerformanceAwareRecommendations,
  getPerformanceAppropriateCareers,
  updateMLEnhancedRecommendations,
  getSimilarCareers,
  getCareerTrends,
  getMLSystemHealth,
} from '../controllers/mlEnhancedRecommendationController.js';

const router = express.Router();

// Performance-aware ML recommendations
router.post('/ml-enhanced', protect, generatePerformanceAwareRecommendations);
router.get('/appropriate-careers', protect, getPerformanceAppropriateCareers);

// Original ML-enhanced recommendations
router.post('/performance-aware', protect, generateMLEnhancedRecommendations); //originally was ml-enhanced
router.put('/ml-enhanced/:id', protect, updateMLEnhancedRecommendations);

// Get similar careers
router.get('/similar/:careerId', getSimilarCareers);

// Get career trends
router.get('/trends', getCareerTrends);

// ML system health check
router.get('/ml-health', getMLSystemHealth);

export default router;
