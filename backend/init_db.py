from app import create_app
from app.extensions import db
from app.models.person import Person
import os
import logging
from sqlalchemy.exc import SQLAlchemyError

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
        try:
            # Log database URI (without credentials)
            db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
            safe_uri = db_uri.split('@')[-1] if '@' in db_uri else db_uri
            logger.info(f"Using database: {safe_uri}")
            
            # Create all tables
            logger.info("Creating database tables...")
            db.create_all()
            
            # Add sample data if no persons exist
            try:
                count = Person.query.count()
                logger.info(f"Current number of persons in database: {count}")
            except SQLAlchemyError as e:
                logger.error(f"Error querying persons table: {e}")
                raise
            
            if count == 0:
                logger.info("Adding sample data...")
                try:
                    # Create root person
                    root = Person(name="CEO", position="Chief Executive Officer")
                    db.session.add(root)
                    logger.info("Added CEO")
                    
                    # Flush to get the ID and verify it was added
                    db.session.flush()
                    logger.info(f"CEO ID: {root.id}")
                    
                    # Create subordinates
                    cto = Person(name="CTO", position="Chief Technology Officer", parent_id=root.id)
                    cfo = Person(name="CFO", position="Chief Financial Officer", parent_id=root.id)
                    db.session.add(cto)
                    db.session.add(cfo)
                    logger.info("Added CTO and CFO")
                    
                    # Flush to get the IDs and verify they were added
                    db.session.flush()
                    logger.info(f"CTO ID: {cto.id}, CFO ID: {cfo.id}")
                    
                    # Create more subordinates
                    dev_lead = Person(name="Dev Lead", position="Development Lead", parent_id=cto.id)
                    qa_lead = Person(name="QA Lead", position="Quality Assurance Lead", parent_id=cto.id)
                    db.session.add(dev_lead)
                    db.session.add(qa_lead)
                    logger.info("Added Dev Lead and QA Lead")
                    
                    # Commit all changes
                    db.session.commit()
                    logger.info("All changes committed successfully!")
                    
                    # Verify the data was added
                    final_count = Person.query.count()
                    logger.info(f"Final number of persons in database: {final_count}")
                    
                except SQLAlchemyError as e:
                    logger.error(f"Error adding sample data: {e}")
                    db.session.rollback()
                    raise
            else:
                logger.info("Database already contains data.")
        except Exception as e:
            logger.error(f"Unexpected error during initialization: {e}")
            raise

if __name__ == '__main__':
    try:
        init_db()
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise 