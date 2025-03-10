from flask import Blueprint, request, jsonify
from app.models.document import Document
from app.extensions import db
from marshmallow import Schema, fields

documents_bp = Blueprint('documents', __name__)

class DocumentSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    description = fields.Str()
    link = fields.Str(required=True)
    is_private = fields.Bool()
    person_id = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

document_schema = DocumentSchema()
documents_schema = DocumentSchema(many=True)

@documents_bp.route('/', methods=['GET'])
def get_documents():
    documents = Document.query.all()
    return jsonify(documents_schema.dump(documents))

@documents_bp.route('/<int:id>', methods=['GET'])
def get_document(id):
    document = Document.query.get_or_404(id)
    return jsonify(document_schema.dump(document))

@documents_bp.route('/person/<int:person_id>', methods=['GET'])
def get_person_documents(person_id):
    documents = Document.query.filter_by(person_id=person_id).all()
    return jsonify(documents_schema.dump(documents))

@documents_bp.route('/', methods=['POST'])
def create_document():
    data = request.get_json()
    document = Document(
        title=data['title'],
        description=data.get('description'),
        link=data['link'],
        is_private=data.get('is_private', False),
        person_id=data['person_id']
    )
    db.session.add(document)
    db.session.commit()
    return jsonify(document_schema.dump(document)), 201

@documents_bp.route('/<int:id>', methods=['PUT'])
def update_document(id):
    document = Document.query.get_or_404(id)
    data = request.get_json()
    
    document.title = data.get('title', document.title)
    document.description = data.get('description', document.description)
    document.link = data.get('link', document.link)
    document.is_private = data.get('is_private', document.is_private)
    
    db.session.commit()
    return jsonify(document_schema.dump(document))

@documents_bp.route('/<int:id>', methods=['DELETE'])
def delete_document(id):
    document = Document.query.get_or_404(id)
    db.session.delete(document)
    db.session.commit()
    return '', 204 