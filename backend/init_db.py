from app import create_app
from app.extensions import db
from app.models.person import Person
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    # Check if initialization should be skipped
    skip_init = os.environ.get('SKIP_DB_INIT', '').lower()
    logger.info(f"SKIP_DB_INIT value: {skip_init}")
    
    if skip_init == 'true':
        logger.info("Skipping database initialization due to SKIP_DB_INIT=true")
        return

    app = create_app()
    with app.app_context():
        # Create all tables
        logger.info("Creating database tables...")
        db.create_all()
        
        # Add sample data if no persons exist
        count = Person.query.count()
        logger.info(f"Current number of persons in database: {count}")
        
        if count == 0:
            logger.info("Adding sample data...")
            # Create root person
            root = Person(name="CEO", position="Chief Executive Officer")
            db.session.add(root)
            db.session.flush()  # Flush to get the ID
            
            # Create subordinates
            cto = Person(name="CTO", position="Chief Technology Officer", parent_id=root.id)
            cfo = Person(name="CFO", position="Chief Financial Officer", parent_id=root.id)
            db.session.add(cto)
            db.session.add(cfo)
            db.session.flush()  # Flush to get the IDs
            
            # Create more subordinates
            dev_lead = Person(name="Dev Lead", position="Development Lead", parent_id=cto.id)
            qa_lead = Person(name="QA Lead", position="Quality Assurance Lead", parent_id=cto.id)
            db.session.add(dev_lead)
            db.session.add(qa_lead)
            
            try:
                # Commit the changes
                db.session.commit()
                logger.info("Sample data added successfully!")
            except Exception as e:
                logger.error(f"Error adding sample data: {e}")
                db.session.rollback()
                raise
        else:
            logger.info("Database already contains data.")

if __name__ == '__main__':
    init_db() 