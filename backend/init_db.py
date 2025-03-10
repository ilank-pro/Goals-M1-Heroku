from app import create_app, db
from app.models.person import Person

def init_db():
    app = create_app()
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Add test data
        if not Person.query.first():
            # Create CEO
            ceo = Person(name="CEO", position="Chief Executive Officer")
            db.session.add(ceo)
            db.session.commit()
            
            # Create C-level executives
            cto = Person(name="CTO", position="Chief Technology Officer", parent_id=ceo.id)
            cfo = Person(name="CFO", position="Chief Financial Officer", parent_id=ceo.id)
            coo = Person(name="COO", position="Chief Operating Officer", parent_id=ceo.id)
            
            db.session.add_all([cto, cfo, coo])
            db.session.commit()
            
            print("Database initialized with test data")
        else:
            print("Database already contains data")

if __name__ == "__main__":
    init_db() 