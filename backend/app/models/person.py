from app.extensions import db
from sqlalchemy.orm import relationship

class Person(db.Model):
    __tablename__ = 'persons'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('persons.id'), nullable=True)
    
    # Relationships
    parent = relationship("Person", remote_side=[id], backref="subordinates")
    goals = relationship("Goal", back_populates="person", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="person", cascade="all, delete-orphan")
    
    def __init__(self, name, position, parent_id=None):
        self.name = name
        self.position = position
        self.parent_id = parent_id
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'position': self.position,
            'parent_id': self.parent_id,
            'subordinates': [subordinate.to_dict() for subordinate in self.subordinates],
            'goals': [goal.to_dict() for goal in self.goals],
            'documents': [document.to_dict() for document in self.documents]
        }
    
    @staticmethod
    def get_org_tree():
        """Return the full organizational tree starting from root nodes"""
        root_nodes = Person.query.filter_by(parent_id=None).all()
        return [node.to_dict() for node in root_nodes] 