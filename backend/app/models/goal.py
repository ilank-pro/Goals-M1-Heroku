from app import db
from sqlalchemy.orm import relationship

class Goal(db.Model):
    __tablename__ = 'goals'
    
    id = db.Column(db.Integer, primary_key=True)
    person_id = db.Column(db.Integer, db.ForeignKey('persons.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    definition = db.Column(db.Text, nullable=True)
    target = db.Column(db.Float, nullable=False, default=0)
    current_value = db.Column(db.Float, nullable=False, default=0)
    is_locked = db.Column(db.Boolean, nullable=False, default=False)
    is_private = db.Column(db.Boolean, nullable=False, default=False)
    
    # Relationship
    person = relationship("Person", back_populates="goals")
    
    def __init__(self, person_id, name, definition=None, target=0, current_value=0, is_locked=False, is_private=False):
        self.person_id = person_id
        self.name = name
        self.definition = definition
        self.target = target
        self.current_value = current_value
        self.is_locked = is_locked
        self.is_private = is_private
    
    def to_dict(self):
        return {
            'id': self.id,
            'person_id': self.person_id,
            'name': self.name,
            'definition': self.definition,
            'target': self.target,
            'current_value': self.current_value,
            'is_locked': self.is_locked,
            'is_private': self.is_private
        }
    
    @staticmethod
    def propagate_goal_changes(goal_id):
        """
        Propagate goal changes upward in the organization hierarchy
        This is called whenever a goal is updated
        """
        from app.models.person import Person
        
        goal = Goal.query.get(goal_id)
        if not goal:
            return
            
        # Don't propagate private goals
        if goal.is_private:
            return
            
        person = Person.query.get(goal.person_id)
        if not person or person.parent_id is None:
            return
            
        # Get all goals with the same name in the parent's hierarchy
        parent = Person.query.get(person.parent_id)
        parent_goal = Goal.query.filter_by(person_id=parent.id, name=goal.name).first()
        
        # If parent doesn't have this goal yet, create it
        if not parent_goal:
            parent_goal = Goal(
                person_id=parent.id,
                name=goal.name,
                definition=goal.definition,
                target=0,
                current_value=0,
                is_locked=False,
                is_private=False
            )
            db.session.add(parent_goal)
            
        # If the goal is not locked at the parent level, update it
        if not parent_goal.is_locked:
            # Calculate the sum of all subordinate goals with the same name
            # Exclude private goals from subordinates
            subordinate_goals = Goal.query.join(Person).filter(
                Person.parent_id == parent.id,
                Goal.name == goal.name,
                Goal.is_private == False
            ).all()
            
            parent_goal.target = sum(g.target for g in subordinate_goals)
            parent_goal.current_value = sum(g.current_value for g in subordinate_goals)
            
            db.session.commit()
            
            # Continue propagation up the hierarchy
            Goal.propagate_goal_changes(parent_goal.id) 