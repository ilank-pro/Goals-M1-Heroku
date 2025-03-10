from app import create_app
from app.extensions import db
from app.models.person import Person
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = create_app()

def init_db():
    with app.app_context():
        # Create all tables
        logger.info("Creating database tables...")
        db.create_all()
        
        # Add sample data if no persons exist
        if Person.query.count() == 0:
            logger.info("Adding sample data...")
            # Create root person
            root = Person(name="CEO", position="Chief Executive Officer")
            db.session.add(root)
            
            # Create subordinates
            cto = Person(name="CTO", position="Chief Technology Officer", parent_id=root.id)
            cfo = Person(name="CFO", position="Chief Financial Officer", parent_id=root.id)
            db.session.add(cto)
            db.session.add(cfo)
            
            # Create more subordinates
            dev_lead = Person(name="Dev Lead", position="Development Lead", parent_id=cto.id)
            qa_lead = Person(name="QA Lead", position="Quality Assurance Lead", parent_id=cto.id)
            db.session.add(dev_lead)
            db.session.add(qa_lead)
            
            # Commit the changes
            db.session.commit()
            logger.info("Sample data added successfully!")
        else:
            logger.info("Database already contains data.")

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Start the application
    port = int(os.environ.get('PORT', 5001))
    logger.info(f"Starting application on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False) 