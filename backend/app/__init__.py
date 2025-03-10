from flask import Flask, send_from_directory
from flask_cors import CORS
from app.extensions import db
from app.routes.persons import persons_bp
from app.routes.goals import goals_bp
from app.routes.documents import documents_bp
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    # Create and configure the app
    app = Flask(__name__, static_folder='static', instance_relative_config=True)
    CORS(app)  # Enable CORS for all routes
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
        logger.info(f"Created instance folder at {app.instance_path}")
    except OSError:
        logger.info(f"Instance folder already exists at {app.instance_path}")
    
    # Configure SQLite database
    db_path = os.path.join(app.instance_path, "app.db")
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    logger.info(f"Database path: {db_path}")
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints with URL prefixes
    app.register_blueprint(persons_bp, url_prefix='/api/persons')
    app.register_blueprint(goals_bp, url_prefix='/api/goals')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    logger.info("Registered all blueprints")
    
    # Serve static files
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    
    return app 