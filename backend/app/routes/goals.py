from flask import Blueprint, request, jsonify
from app.models.goal import Goal
from app.models.person import Person
from app.extensions import db
from marshmallow import Schema, fields

goals_bp = Blueprint('goals', __name__)

@goals_bp.route('/', methods=['GET'])
def get_all_goals():
    """Get all goals in the system"""
    goals = Goal.query.all()
    return jsonify([goal.to_dict() for goal in goals]), 200

@goals_bp.route('/<int:goal_id>', methods=['GET'])
def get_goal(goal_id):
    """Get a specific goal by ID"""
    goal = Goal.query.get_or_404(goal_id)
    return jsonify(goal.to_dict()), 200

@goals_bp.route('/person/<int:person_id>', methods=['GET'])
def get_person_goals(person_id):
    """Get all goals for a specific person"""
    Person.query.get_or_404(person_id)  # Verify person exists
    goals = Goal.query.filter_by(person_id=person_id).all()
    return jsonify([goal.to_dict() for goal in goals]), 200

@goals_bp.route('/parent/<int:person_id>', methods=['GET'])
def get_parent_goals(person_id):
    """Get goals from the parent of a specific person"""
    person = Person.query.get_or_404(person_id)
    if not person.parent_id:
        return jsonify([]), 200
    goals = Goal.query.filter_by(person_id=person.parent_id).all()
    return jsonify([goal.to_dict() for goal in goals]), 200

@goals_bp.route('/', methods=['POST'])
def create_goal():
    """Create a new goal"""
    data = request.get_json()
    
    if not data or 'person_id' not in data or 'name' not in data:
        return jsonify({'error': 'Person ID and goal name are required'}), 400
    
    # Verify person exists
    Person.query.get_or_404(data['person_id'])
    
    new_goal = Goal(
        person_id=data['person_id'],
        name=data['name'],
        definition=data.get('description'),
        current_value=data.get('current_value', 0),
        target=data.get('target', 100),
        is_private=data.get('is_private', False)
    )
    
    db.session.add(new_goal)
    db.session.commit()
    
    # Propagate the new goal to parent nodes
    Goal.propagate_goal_changes(new_goal.id)
    
    return jsonify(new_goal.to_dict()), 201

@goals_bp.route('/<int:goal_id>', methods=['PUT'])
def update_goal(goal_id):
    """Update a goal"""
    goal = Goal.query.get_or_404(goal_id)
    data = request.get_json()
    
    if 'name' in data:
        goal.name = data['name']
    if 'description' in data:
        goal.definition = data['description']
    if 'current_value' in data:
        goal.current_value = data['current_value']
    if 'target' in data:
        goal.target = data['target']
    if 'is_private' in data:
        goal.is_private = data['is_private']
    
    db.session.commit()
    
    # Propagate the changes to parent nodes
    Goal.propagate_goal_changes(goal_id)
    
    return jsonify(goal.to_dict()), 200

@goals_bp.route('/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    """Delete a goal"""
    goal = Goal.query.get_or_404(goal_id)
    db.session.delete(goal)
    db.session.commit()
    return jsonify({'message': 'Goal deleted successfully'}), 200 