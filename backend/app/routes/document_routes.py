from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.document import Document
from app.models.person import Person

document_bp = Blueprint('document_bp', __name__)

@document_bp.route('/', methods=['GET'])
def get_all_documents():
    """Get all documents in the system"""
    documents = Document.query.all()
    return jsonify([document.to_dict() for document in documents]), 200

@document_bp.route('/person/<int:person_id>', methods=['GET'])
def get_person_documents(person_id):
    """Get all documents for a specific person"""
    Person.query.get_or_404(person_id)  # Verify person exists
    documents = Document.query.filter_by(person_id=person_id).all()
    return jsonify([document.to_dict() for document in documents]), 200

@document_bp.route('/', methods=['POST'])
def create_document():
    """Create a new document for a person"""
    data = request.get_json()
    
    if not data or 'person_id' not in data or 'name' not in data or 'html_link' not in data:
        return jsonify({'error': 'Person ID, document name, and HTML link are required'}), 400
    
    # Verify person exists
    Person.query.get_or_404(data['person_id'])
    
    # Create new document
    new_document = Document(
        person_id=data['person_id'],
        name=data['name'],
        description=data.get('description'),
        html_link=data['html_link'],
        is_private=data.get('is_private', False)
    )
    
    db.session.add(new_document)
    db.session.commit()
    
    return jsonify(new_document.to_dict()), 201

@document_bp.route('/<int:document_id>', methods=['PUT'])
def update_document(document_id):
    """Update a document"""
    document = Document.query.get_or_404(document_id)
    data = request.get_json()
    
    if 'name' in data:
        document.name = data['name']
    if 'description' in data:
        document.description = data['description']
    if 'html_link' in data:
        document.html_link = data['html_link']
    if 'is_private' in data:
        document.is_private = data['is_private']
    
    db.session.commit()
    return jsonify(document.to_dict()), 200

@document_bp.route('/<int:document_id>', methods=['DELETE'])
def delete_document(document_id):
    """Delete a document"""
    document = Document.query.get_or_404(document_id)
    db.session.delete(document)
    db.session.commit()
    return jsonify({'message': 'Document deleted successfully'}), 200 