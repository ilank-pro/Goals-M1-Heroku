from app import create_app
from app.extensions import db
from app.models.document import Document

def migrate():
    app = create_app()
    with app.app_context():
        # Create the documents table
        db.create_all()
        print("Documents table created successfully")

if __name__ == '__main__':
    migrate() 