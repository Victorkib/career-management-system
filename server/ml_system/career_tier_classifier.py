import numpy as np
import pandas as pd
from datetime import datetime
import logging

class CareerTierClassifier:
    def __init__(self):
        self.setup_logging()
        self.career_tiers = self.define_career_tiers()
        self.performance_thresholds = self.define_performance_thresholds()
        
    def setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger('CareerTierClassifier')
        
    def define_career_tiers(self):
        """Define career tiers based on prestige, requirements, and market value"""
        return {
            'ELITE': {
                'min_mean_points': 10.5,  # A- and above
                'min_key_subjects_avg': 10.0,  # A- average in key subjects
                'careers': [
                    'medicine', 'surgery', 'dentistry', 'veterinary medicine',
                    'engineering', 'law', 'architecture', 'aviation',
                    'actuarial science', 'medicine', 'pharmacy',
                    'computer science', 'software engineering', 'data science',
                    'investment banking', 'management consulting'
                ],
                'description': 'Highly competitive, prestigious careers requiring exceptional academic performance'
            },
            'PREMIUM': {
                'min_mean_points': 9.0,  # B and above
                'min_key_subjects_avg': 8.5,  # B- average in key subjects
                'careers': [
                    'nursing', 'clinical medicine', 'biomedical engineering',
                    'business administration', 'economics', 'finance',
                    'information technology', 'telecommunications',
                    'journalism', 'mass communication', 'marketing',
                    'psychology', 'social work', 'education',
                    'agricultural engineering', 'environmental science'
                ],
                'description': 'Professional careers requiring good academic performance'
            },
            'STANDARD': {
                'min_mean_points': 7.0,  # C+ and above
                'min_key_subjects_avg': 6.5,  # C average in key subjects
                'careers': [
                    'teaching', 'administration', 'customer service',
                    'sales and marketing', 'human resources',
                    'accounting', 'bookkeeping', 'office administration',
                    'hospitality management', 'tourism',
                    'agriculture', 'veterinary technology',
                    'construction', 'plumbing', 'electrical work',
                    'automotive mechanics', 'fashion design'
                ],
                'description': 'Solid career options requiring moderate academic performance'
            },
            'FOUNDATION': {
                'min_mean_points': 5.0,  # C- and above
                'min_key_subjects_avg': 5.0,  # C- average in key subjects
                'careers': [
                    'skilled trades', 'craftsmanship', 'retail management',
                    'security services', 'driving and logistics',
                    'food service management', 'cleaning services',
                    'basic agriculture', 'small business ownership',
                    'community health work', 'childcare'
                ],
                'description': 'Entry-level careers and skilled trades'
            }
        }
    
    def define_performance_thresholds(self):
        """Define academic performance thresholds"""
        return {
            'EXCELLENT': {'min_points': 9.5, 'description': 'B+ and above grades'},
            'GOOD': {'min_points': 8.0, 'description': 'B and B- grades'},
            'AVERAGE': {'min_points': 6.5, 'description': 'C+ and C grades'},
            'BASIC': {'min_points': 5.0, 'description': 'C- and below grades'}
        }
    
    def classify_student_performance(self, kcse_results):
        """Classify student's academic performance level"""
        try:
            mean_points = kcse_results.get('meanPoints', 0)
            subjects = kcse_results.get('subjects', [])
            
            # Calculate key subjects performance
            science_subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology']
            humanities_subjects = ['English', 'History & Government', 'Geography']
            
            science_avg = self.calculate_subject_category_average(subjects, science_subjects)
            humanities_avg = self.calculate_subject_category_average(subjects, humanities_subjects)
            
            performance_level = 'BASIC'  # Default fallback
            
            # Sort thresholds by min_points in descending order to get the highest match first
            sorted_thresholds = sorted(
                self.performance_thresholds.items(), 
                key=lambda x: x[1]['min_points'], 
                reverse=True
            )
            
            for level, threshold in sorted_thresholds:
                if mean_points >= threshold['min_points']:
                    performance_level = level
                    break
            
            return {
                'level': performance_level,
                'mean_points': mean_points,
                'science_average': science_avg,
                'humanities_average': humanities_avg,
                'strengths': self.identify_academic_strengths(subjects),
                'eligible_tiers': self.get_eligible_career_tiers(mean_points, science_avg, humanities_avg)
            }
            
        except Exception as e:
            self.logger.error(f"Error classifying student performance: {str(e)}")
            return {
                'level': 'AVERAGE',
                'mean_points': 6.0,
                'eligible_tiers': ['FOUNDATION', 'STANDARD']
            }
    
    def calculate_subject_category_average(self, subjects, category_subjects):
        """Calculate average points for a category of subjects"""
        grade_points = {
            'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
            'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
        }
        
        relevant_subjects = [s for s in subjects if s.get('subject', '') in category_subjects]
        if not relevant_subjects:
            return 0
        
        total_points = sum(grade_points.get(s.get('grade', 'E'), 1) for s in relevant_subjects)
        return total_points / len(relevant_subjects)
    
    def identify_academic_strengths(self, subjects):
        """Identify student's academic strengths"""
        grade_points = {
            'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
            'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
        }
        
        strengths = []
        
        # Science strength
        science_subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology']
        science_avg = self.calculate_subject_category_average(subjects, science_subjects)
        if science_avg >= 9:
            strengths.append('SCIENCES')
        
        # Humanities strength  
        humanities_subjects = ['English', 'History & Government', 'Geography']
        humanities_avg = self.calculate_subject_category_average(subjects, humanities_subjects)
        if humanities_avg >= 9:
            strengths.append('HUMANITIES')
        
        # Languages strength
        languages = ['English', 'Kiswahili', 'French', 'German', 'Arabic']
        language_avg = self.calculate_subject_category_average(subjects, languages)
        if language_avg >= 9:
            strengths.append('LANGUAGES')
        
        # Technical/Business strength
        technical_subjects = ['Business Studies', 'Computer Studies', 'Agriculture']
        technical_avg = self.calculate_subject_category_average(subjects, technical_subjects)
        if technical_avg >= 8:
            strengths.append('TECHNICAL')
        
        return strengths if strengths else ['GENERAL']
    
    def get_eligible_career_tiers(self, mean_points, science_avg, humanities_avg):
        """Get career tiers the student is eligible for"""
        eligible_tiers = []
        
        sorted_tiers = sorted(
            self.career_tiers.items(), 
            key=lambda x: x[1]['min_mean_points'], 
            reverse=True
        )
        
        for tier_name, tier_info in sorted_tiers:
            min_mean = tier_info['min_mean_points']
            min_key_avg = tier_info['min_key_subjects_avg']
            
            # Check if student meets minimum requirements
            key_subjects_avg = max(science_avg, humanities_avg)  # Take the better performance
            
            if mean_points >= min_mean and key_subjects_avg >= min_key_avg:
                eligible_tiers.append(tier_name)
        
        # Tightened policy: do not automatically include all lower tiers.
        # Prioritize exhausting high tiers before showing lower ones.
        if 'ELITE' in eligible_tiers:
            eligible_tiers = ['ELITE', 'PREMIUM']
        elif 'PREMIUM' in eligible_tiers:
            eligible_tiers = ['PREMIUM', 'STANDARD']
        elif 'STANDARD' in eligible_tiers:
            eligible_tiers = ['STANDARD', 'FOUNDATION']
        elif not eligible_tiers:
            eligible_tiers = ['FOUNDATION']
        
        return eligible_tiers
    
    def filter_careers_by_performance(self, careers, student_performance):
        """Filter careers based on student's academic performance"""
        try:
            eligible_tiers = student_performance.get('eligible_tiers', ['FOUNDATION'])
            eligible_career_names = set()
            
            # Collect all eligible career names from tiers
            for tier_name in eligible_tiers:
                if tier_name in self.career_tiers:
                    eligible_career_names.update(self.career_tiers[tier_name]['careers'])
            
            # Filter careers and add tier information
            filtered_careers = []
            for career in careers:
                career_title_lower = career.get('title', '').lower()
                career_category_lower = career.get('category', '').lower()
                
                # Check if career matches eligible careers
                career_tier = self.determine_career_tier(career)
                
                if career_tier in eligible_tiers:
                    career['tier'] = career_tier
                    career['tier_description'] = self.career_tiers[career_tier]['description']
                    career['performance_match'] = self.calculate_performance_match(
                        student_performance, career_tier
                    )
                    filtered_careers.append(career)
            
            # Optionally prune very low tiers for top performers
            performance_level = student_performance.get('level', 'AVERAGE')
            if performance_level == 'EXCELLENT':
                filtered_careers = [c for c in filtered_careers if c.get('tier') in ['ELITE', 'PREMIUM']]
            elif performance_level == 'GOOD':
                filtered_careers = [c for c in filtered_careers if c.get('tier') in ['PREMIUM', 'STANDARD']]

            # Sort by tier priority and performance match
            tier_priority = {'ELITE': 4, 'PREMIUM': 3, 'STANDARD': 2, 'FOUNDATION': 1}
            filtered_careers.sort(
                key=lambda x: (tier_priority.get(x.get('tier', 'FOUNDATION'), 1), 
                             x.get('performance_match', 0)), 
                reverse=True
            )
            
            return filtered_careers
            
        except Exception as e:
            self.logger.error(f"Error filtering careers: {str(e)}")
            return careers  # Return original careers if filtering fails
    
    def determine_career_tier(self, career):
        """Determine which tier a career belongs to"""
        career_title = career.get('title', '').lower()
        career_category = career.get('category', '').lower()
        
        # Check each tier for matching careers
        for tier_name, tier_info in self.career_tiers.items():
            tier_careers = [c.lower() for c in tier_info['careers']]
            
            # Direct title match
            if any(tier_career in career_title for tier_career in tier_careers):
                return tier_name
            
            # Category-based matching
            if career_category in tier_careers:
                return tier_name
        
        # Default classification based on minimum grade requirements
        min_grade = career.get('minimumMeanGrade', 'C')
        grade_points = {
            'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8,
            'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
        }
        
        min_points = grade_points.get(min_grade, 6)
        
        if min_points >= 10:
            return 'ELITE'
        elif min_points >= 8:
            return 'PREMIUM'
        elif min_points >= 6:
            return 'STANDARD'
        else:
            return 'FOUNDATION'
    
    def calculate_performance_match(self, student_performance, career_tier):
        """Calculate how well student's performance matches career tier"""
        student_points = student_performance.get('mean_points', 6)
        tier_min_points = self.career_tiers[career_tier]['min_mean_points']
        
        # Calculate match percentage
        if student_points >= tier_min_points:
            # Bonus for exceeding minimum requirements
            excess = student_points - tier_min_points
            match = 85 + min(excess * 3, 15)  # Max 100%
        else:
            # Penalty for not meeting minimum requirements
            deficit = tier_min_points - student_points
            match = max(50 - deficit * 10, 10)  # Min 10%
        
        return min(100, max(10, match))
    
    def get_career_recommendations_summary(self, student_performance, filtered_careers):
        """Generate a summary of career recommendations"""
        try:
            performance_level = student_performance.get('level', 'AVERAGE')
            eligible_tiers = student_performance.get('eligible_tiers', ['FOUNDATION'])
            
            summary = {
                'student_performance_level': performance_level,
                'eligible_career_tiers': eligible_tiers,
                'total_recommended_careers': len(filtered_careers),
                'tier_distribution': {},
                'personalized_message': self.generate_personalized_message(
                    student_performance, eligible_tiers
                )
            }
            
            # Calculate tier distribution
            for career in filtered_careers:
                tier = career.get('tier', 'FOUNDATION')
                summary['tier_distribution'][tier] = summary['tier_distribution'].get(tier, 0) + 1
            
            return summary
            
        except Exception as e:
            self.logger.error(f"Error generating summary: {str(e)}")
            return {
                'student_performance_level': 'AVERAGE',
                'eligible_career_tiers': ['STANDARD', 'FOUNDATION'],
                'total_recommended_careers': len(filtered_careers)
            }
    
    def generate_personalized_message(self, student_performance, eligible_tiers):
        """Generate personalized message based on performance"""
        performance_level = student_performance.get('level', 'AVERAGE')
        mean_points = student_performance.get('mean_points', 6)
        
        if 'ELITE' in eligible_tiers:
            return f"Congratulations! With your exceptional performance ({mean_points:.1f} points), you're eligible for the most competitive and prestigious career paths including Medicine, Engineering, and Law."
        
        elif 'PREMIUM' in eligible_tiers:
            return f"Excellent work! Your strong academic performance ({mean_points:.1f} points) opens doors to professional careers in healthcare, business, technology, and education."
        
        elif 'STANDARD' in eligible_tiers:
            return f"Good job! With your solid performance ({mean_points:.1f} points), you have access to many fulfilling career opportunities in various fields including skilled trades and professional services."
        
        else:
            return f"You have access to foundational career paths that can lead to success and growth. Consider additional training or certification to expand your opportunities."

# Usage example
if __name__ == "__main__":
    classifier = CareerTierClassifier()
    print("Career Tier Classifier initialized successfully!")
