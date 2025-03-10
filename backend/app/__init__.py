from flask import Flask
from flask_cors import CORS
from app.extensions import db
from app.routes.persons import persons_bp
from app.routes.goals import goals_bp
from app.routes.documents import documents_bp

def create_app():
    # Create and configure the app
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # Configure SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(persons_bp)
    app.register_blueprint(goals_bp)
    app.register_blueprint(documents_bp)
    
    return app 