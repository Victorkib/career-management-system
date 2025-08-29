#!/usr/bin/env python3
import sys
import json
import os
from datetime import datetime
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

# Import our ML models
from collaborative_filtering_model import CollaborativeFilteringModel
from academic_performance_predictor import AcademicPerformancePredictor
from career_tier_classifier import CareerTierClassifier

# Load environment variables
load_dotenv()

class EnhancedMLIntegrationService:
    def __init__(self):
        self.setup_logging()
        self.connect_to_database()
        self.cf_model = CollaborativeFilteringModel()
        self.ap_model = AcademicPerformancePredictor()
        self.career_classifier = CareerTierClassifier()
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger('EnhancedMLIntegrationService')
    
    def connect_to_database(self):
        """Connect to MongoDB database"""
        try:
            mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/career_recommender')
            self.client = MongoClient(mongodb_uri)
            self.db = self.client.get_default_database()
            
            # Test connection
            self.client.admin.command('ping')
            self.logger.info("Connected to MongoDB successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to connect to MongoDB: {str(e)}")
            self.client = None
            self.db = None
    
    def enhance_recommendations_with_performance_filtering(self, user_data, recommendations):
        """Enhanced recommendations with performance-based filtering"""
        try:
            self.logger.info("Enhancing recommendations with performance-based filtering...")
            
            # Step 1: Classify student's academic performance
            kcse_results = user_data.get('kcseResults', {})
            student_performance = self.career_classifier.classify_student_performance(kcse_results)
            
            mean_points = kcse_results.get('meanPoints', 0)
            self.logger.info(f"Student KCSE Results - Mean Points: {mean_points}")
            self.logger.info(f"Student performance level: {student_performance['level']}")
            self.logger.info(f"Eligible career tiers: {student_performance['eligible_tiers']}")
            
            # Debug: Log the performance thresholds being used
            for level, threshold in self.career_classifier.performance_thresholds.items():
                meets_threshold = mean_points >= threshold['min_points']
                self.logger.info(f"Performance threshold {level}: {threshold['min_points']} - Student meets: {meets_threshold}")
            
            # Step 2: Filter careers based on performance level
            performance_filtered_careers = self.career_classifier.filter_careers_by_performance(
                recommendations, student_performance
            )
            
            self.logger.info(f"Filtered from {len(recommendations)} to {len(performance_filtered_careers)} appropriate careers")
            
            tier_counts = {}
            for career in performance_filtered_careers:
                tier = career.get('tier', 'UNKNOWN')
                tier_counts[tier] = tier_counts.get(tier, 0) + 1
            self.logger.info(f"Career tier distribution: {tier_counts}")
            
            # Step 3: Apply ML enhancements to filtered careers only
            enhanced_recommendations = []
            
            # Load ML models
            self.cf_model.load_model()
            self.ap_model.load_models()
            
            for rec in performance_filtered_careers:
                enhanced_rec = rec.copy()
                
                # Get collaborative filtering score
                user_id = user_data.get('_id', 'unknown')
                cf_recommendations = self.cf_model.get_user_recommendations(str(user_id), 20)
                
                career_id = str(rec.get('id', ''))
                cf_score = None
                
                for cf_rec in cf_recommendations:
                    if cf_rec['career_id'] == career_id:
                        cf_score = cf_rec['ml_enhanced_score']
                        break
                
                # Get academic performance prediction
                ap_score = None
                improvement_suggestions = []
                
                if kcse_results:
                    ap_score = self.ap_model.predict_career_match(kcse_results, career_id)
                    
                    career_data = {
                        '_id': career_id,
                        'title': rec.get('title', 'Unknown Career'),
                        'keySubjects': rec.get('keySubjects', [])
                    }
                    improvement_suggestions = self.ap_model.get_improvement_suggestions(
                        user_data, career_data
                    )
                
                # Calculate final score with performance weighting
                original_score = rec.get('match', 0)
                performance_match = rec.get('performance_match', 75)
                
                # Weighted combination:
                # 40% original rule-based score
                # 30% performance tier match  
                # 20% collaborative filtering
                # 10% academic predictor
                
                final_score = (
                    0.4 * original_score +
                    0.3 * performance_match +
                    0.2 * (cf_score * 100 if cf_score else original_score) +
                    0.1 * (ap_score if ap_score else original_score)
                )
                
                # Add performance-based boost for appropriate tier careers
                career_tier = rec.get('tier', 'FOUNDATION')
                if career_tier in student_performance['eligible_tiers']:
                    tier_boost = {'ELITE': 10, 'PREMIUM': 7, 'STANDARD': 5, 'FOUNDATION': 2}
                    final_score += tier_boost.get(career_tier, 0)
                
                enhanced_rec['ml_enhanced_score'] = min(100, max(0, final_score))
                enhanced_rec['improvement_suggestions'] = improvement_suggestions
                enhanced_rec['performance_level'] = student_performance['level']
                
                # Add performance-aware reasons
                enhanced_rec['ml_reasons'] = []
                
                if cf_score:
                    enhanced_rec['ml_reasons'].append(
                        "Students with similar academic profiles showed strong interest in this career"
                    )
                
                if performance_match >= 85:
                    enhanced_rec['ml_reasons'].append(
                        f"This career is well-suited for your {student_performance['level'].lower()} academic performance"
                    )
                
                if career_tier == 'ELITE' and 'ELITE' in student_performance['eligible_tiers']:
                    enhanced_rec['ml_reasons'].append(
                        "Your exceptional grades qualify you for this highly competitive career path"
                    )
                elif career_tier == 'PREMIUM' and 'PREMIUM' in student_performance['eligible_tiers']:
                    enhanced_rec['ml_reasons'].append(
                        "Your strong academic performance makes you a competitive candidate for this professional career"
                    )
                
                enhanced_recommendations.append(enhanced_rec)
            
            # Tier-aware ordering: exhaust higher tiers before moving to lower ones
            tier_priority = {'ELITE': 4, 'PREMIUM': 3, 'STANDARD': 2, 'FOUNDATION': 1}
            # Restrict to eligible tiers order (already pruned), but still enforce priority
            by_tier = {}
            for rec in enhanced_recommendations:
                tier = rec.get('tier', 'FOUNDATION')
                by_tier.setdefault(tier, []).append(rec)
            # Sort each tier bucket by ML score desc
            for tier_list in by_tier.values():
                tier_list.sort(key=lambda r: r.get('ml_enhanced_score', r.get('match', 0)), reverse=True)
            # Rebuild list by tier priority
            ordered = []
            for tier in sorted(by_tier.keys(), key=lambda t: tier_priority.get(t, 0), reverse=True):
                ordered.extend(by_tier[tier])
            enhanced_recommendations = ordered
            
            # Generate summary
            recommendations_summary = self.career_classifier.get_career_recommendations_summary(
                student_performance, enhanced_recommendations
            )
            
            return {
                'success': True,
                'enhanced_recommendations': enhanced_recommendations,
                'ml_enhanced': True,
                'performance_filtering_applied': True,
                'student_performance': student_performance,
                'recommendations_summary': recommendations_summary,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error in enhanced recommendations: {str(e)}")
            return {
                'success': False,
                'enhanced_recommendations': recommendations,
                'ml_enhanced': False,
                'performance_filtering_applied': False,
                'error': str(e)
            }
    
    def get_performance_appropriate_careers(self, user_data, limit=20):
        """Get careers appropriate for user's performance level"""
        try:
            kcse_results = user_data.get('kcseResults', {})
            student_performance = self.career_classifier.classify_student_performance(kcse_results)
            
            # Get all careers from database
            if self.db:
                all_careers = list(self.db.careers.find())
            else:
                # Fallback careers for testing
                all_careers = self.get_dummy_careers()
            
            # Filter careers based on performance
            appropriate_careers = self.career_classifier.filter_careers_by_performance(
                all_careers, student_performance
            )
            
            return {
                'success': True,
                'careers': appropriate_careers[:limit],
                'student_performance': student_performance,
                'total_appropriate_careers': len(appropriate_careers)
            }
            
        except Exception as e:
            self.logger.error(f"Error getting performance appropriate careers: {str(e)}")
            return {
                'success': False,
                'careers': [],
                'error': str(e)
            }
    
    def get_dummy_careers(self):
        """Get dummy careers for testing"""
        return [
            {
                'id': '1', 'title': 'Medicine', 'category': 'Healthcare',
                'minimumMeanGrade': 'A-', 'keySubjects': ['Biology', 'Chemistry', 'Physics'],
                'marketDemand': 'Very High', 'match': 95
            },
            {
                'id': '2', 'title': 'Software Engineering', 'category': 'Technology',
                'minimumMeanGrade': 'B+', 'keySubjects': ['Mathematics', 'Physics'],
                'marketDemand': 'Very High', 'match': 90
            },
            {
                'id': '3', 'title': 'Teaching', 'category': 'Education',
                'minimumMeanGrade': 'C+', 'keySubjects': ['English', 'Mathematics'],
                'marketDemand': 'High', 'match': 80
            },
            {
                'id': '4', 'title': 'Agriculture', 'category': 'Agriculture',
                'minimumMeanGrade': 'C', 'keySubjects': ['Biology', 'Chemistry'],
                'marketDemand': 'Medium', 'match': 70
            }
        ]
    
    # Keep all existing methods from original ml_integration_service.py
    def load_data_from_db(self):
        """Load data from MongoDB for training"""
        try:
            if self.db is None:
                self.logger.error("No database connection available")
                return None, None
            
            recommendations_data = list(self.db.recommendations.find())
            self.logger.info(f"Loaded {len(recommendations_data)} recommendation records")
            
            careers_data = list(self.db.careers.find())
            self.logger.info(f"Loaded {len(careers_data)} career records")
            
            return recommendations_data, careers_data
            
        except Exception as e:
            self.logger.error(f"Error loading data from database: {str(e)}")
            return None, None
    
    def train_models(self):
        """Train all ML models"""
        try:
            self.logger.info("Starting enhanced ML model training...")
            
            recommendations_data, careers_data = self.load_data_from_db()
            
            if not recommendations_data or not careers_data:
                self.logger.warning("Insufficient data for training, creating dummy models")
                return self.create_dummy_models()
            
            # Train collaborative filtering model
            if self.cf_model.prepare_data(recommendations_data, careers_data):
                self.cf_model.train_user_based_cf()
                self.cf_model.train_item_based_cf()
                self.cf_model.train_matrix_factorization()
                self.cf_model.save_model()
            
            # Train academic performance predictor
            training_data = self.ap_model.prepare_data(recommendations_data)
            if training_data is not None and not training_data.empty:
                self.ap_model.train_models(training_data)
                self.ap_model.save_models()
            
            return {
                'success': True,
                'message': 'Enhanced models trained successfully with performance filtering',
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error training enhanced models: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def create_dummy_models(self):
        """Create dummy models when no training data is available"""
        try:
            self.logger.info("Creating enhanced dummy models for testing...")
            
            dummy_recommendations = [
                {'user': 'user1', 'recommendations': [
                    {'career': 'career1', 'match': 95}, {'career': 'career2', 'match': 85}
                ]},
                {'user': 'user2', 'recommendations': [
                    {'career': 'career1', 'match': 90}, {'career': 'career3', 'match': 80}
                ]}
            ]
            
            dummy_careers = [
                {'_id': 'career1', 'title': 'Medicine', 'category': 'Healthcare'},
                {'_id': 'career2', 'title': 'Engineering', 'category': 'Technology'},
                {'_id': 'career3', 'title': 'Teaching', 'category': 'Education'}
            ]
            
            if self.cf_model.prepare_data(dummy_recommendations, dummy_careers):
                self.cf_model.train_user_based_cf()
                self.cf_model.save_model()
            
            return {
                'success': True,
                'message': 'Enhanced dummy models created with performance filtering',
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def health_check(self):
        """Enhanced health check"""
        try:
            health_status = {
                'healthy': True,
                'status': 'operational',
                'components': {
                    'database': False,
                    'collaborative_filtering': False,
                    'academic_predictor': False,
                    'career_tier_classifier': True  # Always available
                },
                'features': {
                    'performance_filtering': True,
                    'tier_based_recommendations': True,
                    'intelligent_career_matching': True
                },
                'timestamp': datetime.now().isoformat()
            }
            
            # Check database
            if self.db is not None:
                try:
                    self.client.admin.command('ping')
                    health_status['components']['database'] = True
                except:
                    pass
            
            # Check models
            cf_exists = os.path.exists('./models/collaborative_filtering_model.pkl')
            ap_exists = os.path.exists('./models/academic_performance_models.pkl')
            
            health_status['components']['collaborative_filtering'] = cf_exists
            health_status['components']['academic_predictor'] = ap_exists
            
            models_healthy = cf_exists or ap_exists
            health_status['healthy'] = models_healthy
            health_status['status'] = 'operational' if models_healthy else 'degraded'
            
            return health_status
            
        except Exception as e:
            return {
                'healthy': False,
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No command provided'}))
        sys.exit(1)
    
    command = sys.argv[1]
    service = EnhancedMLIntegrationService()
    
    try:
        if command == 'train_models':
            result = service.train_models()
            print(json.dumps(result))
            
        elif command == 'enhance_recommendations':
            input_data = json.loads(sys.stdin.read())
            user_data = input_data.get('user', {})
            recommendations = input_data.get('recommendations', [])
            
            result = service.enhance_recommendations_with_performance_filtering(user_data, recommendations)
            print(json.dumps(result))
            
        elif command == 'get_appropriate_careers':
            input_data = json.loads(sys.stdin.read())
            user_data = input_data.get('user', {})
            limit = input_data.get('limit', 20)
            
            result = service.get_performance_appropriate_careers(user_data, limit)
            print(json.dumps(result))
            
        elif command == 'health_check':
            result = service.health_check()
            print(json.dumps(result))
            
        else:
            print(json.dumps({'error': f'Unknown command: {command}'}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()
