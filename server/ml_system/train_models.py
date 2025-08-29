#!/usr/bin/env python3
"""
Training script for ML models
"""
import os
import sys
import logging
from datetime import datetime
from enhanced_ml_integration_service import EnhancedMLIntegrationService

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('training.log')
        ]
    )

def main():
    """Main training function"""
    setup_logging()
    logger = logging.getLogger(__name__)
    
    logger.info("=" * 50)
    logger.info("Starting ML Model Training")
    logger.info("=" * 50)
    
    try:
        # Initialize ML service
        service = EnhancedMLIntegrationService()
        
        # Train models
        result = service.train_models()
        
        if result['success']:
            logger.info("✅ Training completed successfully!")
            logger.info(f"Message: {result['message']}")
        else:
            logger.error("❌ Training failed!")
            logger.error(f"Error: {result.get('error', 'Unknown error')}")
            sys.exit(1)
            
    except Exception as e:
        logger.error(f"❌ Training failed with exception: {str(e)}")
        sys.exit(1)
    
    logger.info("=" * 50)
    logger.info("Training process completed")
    logger.info("=" * 50)

if __name__ == '__main__':
    main()
