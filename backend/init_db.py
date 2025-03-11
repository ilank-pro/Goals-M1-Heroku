from app import create_app
from app.extensions import db
from app.models.person import Person

def init_db():
    app = create_app()
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Add sample data if no persons exist
        if Person.query.count() == 0:
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
            print("Sample data added successfully!")
        else:
            print("Database already contains data.")

if __name__ == '__main__':
    init_db() 