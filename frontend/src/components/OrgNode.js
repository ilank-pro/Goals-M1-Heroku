import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const OrgNode = ({ node, onNodeSelect, isSelected }) => {
  const navigate = useNavigate();
  // Add local state to track selection with a more descriptive name
  const [highlighted, setHighlighted] = useState(isSelected);
  
  // Update local state when props change - this is critical for maintaining state
  useEffect(() => {
    setHighlighted(isSelected);
  }, [isSelected]);
  
  const handleNodeClick = () => {
    // When a node is clicked, update the selection state
    onNodeSelect(node);
  };
  
  const handleNodeDoubleClick = () => {
    // Before navigating, ensure the current node is marked as selected
    try {
      // Save the current node ID as the selected node
      localStorage.setItem('org_tree_selected_node', node.id);
      
      // Get current expanded nodes and save them
      const expandedNodesStr = localStorage.getItem('org_tree_expanded_nodes');
      if (expandedNodesStr) {
        // Make sure we keep the expanded nodes state
        localStorage.setItem('org_tree_expanded_nodes', expandedNodesStr);
      }
      
      // Set a timestamp to force a refresh when returning
      localStorage.setItem('org_tree_last_visit', Date.now().toString());
    } catch (err) {
      console.error('Error saving node state before navigation:', err);
    }
    
    // Navigate to the person detail page
    navigate(`/person/${node.id}`);
  };
  
  // Format number to show only 3 decimal points
  const formatNumber = (num) => {
    return typeof num === 'number' ? Number(num.toFixed(3)).toString() : num;
  };
  
  return (
    <Card 
      className="org-node" 
      onClick={handleNodeClick}
      onDoubleClick={handleNodeDoubleClick}
      sx={{ 
        minWidth: 200,
        m: 1,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: highlighted ? '2px solid orange' : '1px solid #e0e0e0',
        boxShadow: highlighted ? 3 : 1,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <PersonIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {node.name}
          </Typography>
        </Box>
        <Typography color="text.secondary" gutterBottom>
          {node.position}
        </Typography>
        
        {node.goals && node.goals.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Goals:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
              {node.goals.map(goal => (
                <Chip 
                  key={goal.id} 
                  icon={<TrackChangesIcon />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {goal.is_private && (
                        <Box
                          sx={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: 'red',
                            flexShrink: 0
                          }}
                        />
                      )}
                      {`${goal.name}: ${formatNumber(goal.current_value)}/${formatNumber(goal.target)}`}
                    </Box>
                  }
                  size="small"
                  color={goal.is_locked ? "secondary" : "primary"}
                  variant={goal.is_locked ? "filled" : "outlined"}
                />
              ))}
            </Box>
          </Box>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {node.subordinates && node.subordinates.length > 0 
            ? `${node.subordinates.length} subordinates` 
            : 'No subordinates'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrgNode; 