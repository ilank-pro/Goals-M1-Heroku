from flask import Flask, send_from_directory
from flask_cors import CORS
from app.extensions import db
from app.routes.persons import persons_bp
from app.routes.goals import goals_bp
from app.routes.documents import documents_bp
import os

def create_app():
    # Create and configure the app
    app = Flask(__name__, static_folder='static', instance_relative_config=True)
    CORS(app)  # Enable CORS for all routes
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Configure SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(app.instance_path, "app.db")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    
    # Register blueprints with URL prefixes
    app.register_blueprint(persons_bp, url_prefix='/api/persons')
    app.register_blueprint(goals_bp, url_prefix='/api/goals')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    
    # Serve static files
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    
    return app 