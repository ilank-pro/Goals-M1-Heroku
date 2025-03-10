import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Tree, TreeNode } from 'react-organizational-chart';
import OrgNode from '../components/OrgNode';
import PersonFormDialog from '../components/PersonFormDialog';
import { personApi } from '../services/api';

// Keys for localStorage
const SELECTED_NODE_KEY = 'org_tree_selected_node';
const EXPANDED_NODES_KEY = 'org_tree_expanded_nodes';
const LAST_VISIT_KEY = 'org_tree_last_visit';

const OrgTreePage = () => {
  const [orgTree, setOrgTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [isNewPerson, setIsNewPerson] = useState(true);
  const [defaultParentId, setDefaultParentId] = useState('');
  const [lastVisitTimestamp, setLastVisitTimestamp] = useState(0);
  
  // Fetch organization tree data
  const fetchOrgTree = async () => {
    try {
      setLoading(true);
      const data = await personApi.getOrgTree();
      setOrgTree(data);
      setError(null);
      
      // Check if we have a last visit timestamp
      const storedTimestamp = localStorage.getItem(LAST_VISIT_KEY);
      if (storedTimestamp) {
        setLastVisitTimestamp(parseInt(storedTimestamp, 10));
        // Clear the timestamp after using it
        localStorage.removeItem(LAST_VISIT_KEY);
      }
      
      // After loading the tree, restore the selected node and expanded nodes
      restoreTreeState(data);
    } catch (err) {
      console.error('Error fetching org tree:', err);
      setError('Failed to load organization tree. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Find a node by ID in the tree (recursive)
  const findNodeById = (nodes, id) => {
    if (!nodes || nodes.length === 0) return null;
    
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      
      if (node.subordinates && node.subordinates.length > 0) {
        const foundNode = findNodeById(node.subordinates, id);
        if (foundNode) return foundNode;
      }
    }
    
    return null;
  };
  
  // Restore the selected node and expanded nodes from localStorage
  const restoreTreeState = (treeData) => {
    try {
      // Restore expanded nodes first
      const savedExpandedNodes = localStorage.getItem(EXPANDED_NODES_KEY);
      if (savedExpandedNodes) {
        try {
          const expandedNodeIds = JSON.parse(savedExpandedNodes);
          setExpandedNodes(new Set(expandedNodeIds));
        } catch (parseErr) {
          console.error('Error parsing expanded nodes:', parseErr);
        }
      }
      
      // Then restore selected node
      const savedSelectedNodeId = localStorage.getItem(SELECTED_NODE_KEY);
      if (savedSelectedNodeId) {
        const node = findNodeById(treeData, savedSelectedNodeId);
        if (node) {
          // Force a new object reference to trigger re-render
          setSelectedNode(JSON.parse(JSON.stringify(node)));
          
          // Ensure the node is visible by expanding its parent nodes
          const parentPath = findNodePath(treeData, savedSelectedNodeId);
          if (parentPath.length > 0) {
            const newExpandedNodes = new Set(expandedNodes);
            // Add all parent nodes to expanded set (except the last one which is the node itself)
            parentPath.slice(0, -1).forEach(parentId => {
              newExpandedNodes.add(parentId);
            });
            setExpandedNodes(newExpandedNodes);
          }
        }
      }
    } catch (err) {
      console.error('Error restoring tree state:', err);
    }
  };
  
  // Find the path from root to a node by ID
  const findNodePath = (nodes, targetId, currentPath = []) => {
    if (!nodes || nodes.length === 0) return [];
    
    for (const node of nodes) {
      // Try this node
      const newPath = [...currentPath, node.id];
      if (node.id === targetId) {
        return newPath;
      }
      
      // Try children
      if (node.subordinates && node.subordinates.length > 0) {
        const pathInChildren = findNodePath(node.subordinates, targetId, newPath);
        if (pathInChildren.length > 0) {
          return pathInChildren;
        }
      }
    }
    
    return [];
  };
  
  // Save the current tree state to localStorage
  const saveTreeState = (nodeId, expandedNodeIds) => {
    try {
      if (nodeId) {
        localStorage.setItem(SELECTED_NODE_KEY, nodeId);
      }
      
      if (expandedNodeIds) {
        localStorage.setItem(EXPANDED_NODES_KEY, JSON.stringify(Array.from(expandedNodeIds)));
      }
    } catch (err) {
      console.error('Error saving tree state:', err);
    }
  };
  
  useEffect(() => {
    fetchOrgTree();
    
    // Add an event listener for when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When returning to the page, refresh the tree to ensure state is properly restored
        fetchOrgTree();
      }
    };
    
    // Add an event listener for when the user navigates back to this page
    const handlePopState = () => {
      // When navigating back, refresh the tree to ensure state is properly restored
      fetchOrgTree();
    };
    
    // Add an event listener for storage changes to handle cross-tab synchronization
    const handleStorageChange = (event) => {
      if (event.key === SELECTED_NODE_KEY || event.key === LAST_VISIT_KEY) {
        // When the selected node changes in another tab or the last visit timestamp is updated
        fetchOrgTree();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Effect to ensure selected node state is maintained
  useEffect(() => {
    if (selectedNode) {
      // Ensure the selected node ID is saved to localStorage whenever it changes
      localStorage.setItem(SELECTED_NODE_KEY, selectedNode.id);
    }
  }, [selectedNode]);
  
  // Effect to handle the lastVisitTimestamp
  useEffect(() => {
    // When lastVisitTimestamp changes, it means we've returned from another page
    if (lastVisitTimestamp > 0) {
      // Check if we have a selected node ID in localStorage
      const savedSelectedNodeId = localStorage.getItem(SELECTED_NODE_KEY);
      if (savedSelectedNodeId) {
        // Find the node in the tree data
        const node = findNodeById(orgTree, savedSelectedNodeId);
        if (node) {
          // Force a new object reference to trigger re-render
          setSelectedNode(JSON.parse(JSON.stringify(node)));
          
          // Ensure the node is visible by expanding its parent nodes
          const parentPath = findNodePath(orgTree, savedSelectedNodeId);
          if (parentPath.length > 0) {
            const newExpandedNodes = new Set(expandedNodes);
            // Add all parent nodes to expanded set (except the last one which is the node itself)
            parentPath.slice(0, -1).forEach(parentId => {
              newExpandedNodes.add(parentId);
            });
            setExpandedNodes(newExpandedNodes);
          }
        }
      }
    }
  }, [lastVisitTimestamp, orgTree]);
  
  const handleNodeSelect = (node) => {
    // Toggle expansion when clicking on a node
    const nodeId = node.id;
    
    // If clicking the same node that's already selected
    if (selectedNode && selectedNode.id === nodeId) {
      // Toggle expansion state
      const newExpandedNodes = new Set(expandedNodes);
      if (newExpandedNodes.has(nodeId)) {
        newExpandedNodes.delete(nodeId);
      } else {
        newExpandedNodes.add(nodeId);
      }
      setExpandedNodes(newExpandedNodes);
      
      // Re-select the node to ensure UI updates
      setSelectedNode({...node});
      
      saveTreeState(nodeId, newExpandedNodes);
    } else {
      // If selecting a new node, select it and expand it if not already expanded
      setSelectedNode({...node});
      if (!expandedNodes.has(nodeId)) {
        const newExpandedNodes = new Set(expandedNodes);
        newExpandedNodes.add(nodeId);
        setExpandedNodes(newExpandedNodes);
        saveTreeState(nodeId, newExpandedNodes);
      } else {
        saveTreeState(nodeId, expandedNodes);
      }
    }
  };
  
  const handleAddPerson = () => {
    setIsNewPerson(true);
    // Set the default parent ID to the selected node's ID if a node is selected
    setDefaultParentId(selectedNode ? selectedNode.id : '');
    setOpenDialog(true);
  };
  
  const handleEditPerson = () => {
    if (selectedNode) {
      setIsNewPerson(false);
      setDefaultParentId(''); // No default parent when editing
      setOpenDialog(true);
    }
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleSavePerson = async (personData) => {
    try {
      if (isNewPerson) {
        await personApi.createPerson(personData);
      } else {
        await personApi.updatePerson(selectedNode.id, personData);
      }
      
      // Refresh the tree
      fetchOrgTree();
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving person:', err);
      setError('Failed to save person data. Please try again.');
    }
  };
  
  // Recursive function to render the tree
  const renderTree = (nodes) => {
    if (!nodes || nodes.length === 0) return null;
    
    return nodes.map(node => {
      const isExpanded = expandedNodes.has(node.id);
      // Explicitly check if the current node ID matches the selected node ID
      const isNodeSelected = selectedNode && selectedNode.id === node.id;
      
      // Add a key that includes the selection state and timestamp to force re-render
      // This is crucial for ensuring the component re-renders when selection changes
      const nodeKey = `${node.id}-${isNodeSelected ? 'selected' : 'not-selected'}-${lastVisitTimestamp}`;
      
      return (
        <TreeNode 
          key={nodeKey} 
          label={
            <OrgNode 
              node={node} 
              onNodeSelect={handleNodeSelect} 
              isSelected={isNodeSelected}
            />
          }
        >
          {/* Only render subordinates if the node is expanded */}
          {isExpanded && node.subordinates && node.subordinates.length > 0 && 
            renderTree(node.subordinates)}
        </TreeNode>
      );
    });
  };
  
  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        height: 'calc(100vh - 64px)', // Adjust for app bar height if present
        display: 'flex',
        flexDirection: 'column',
        p: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Organization Structure
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAddPerson}
            sx={{ mr: 1 }}
          >
            Add Person
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleEditPerson}
            disabled={!selectedNode}
          >
            Edit Selected
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
      
      <Paper 
        className="org-tree-container" 
        sx={{ 
          p: 3, 
          overflowX: 'auto',
          overflowY: 'auto',
          flexGrow: 1, // Take up all available space
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          '& .MuiBox-root': { // Target the Tree component's container
            minWidth: 'fit-content',
            minHeight: 'fit-content'
          }
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <CircularProgress />
          </Box>
        ) : orgTree.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" color="text.secondary">
              No organization data available. Add a person to get started.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            minWidth: 'fit-content', 
            minHeight: 'fit-content',
            display: 'inline-block',
            margin: '0 auto', // Center horizontally
            flexGrow: 1
          }}>
            <Tree
              lineWidth="2px"
              lineColor="#bdbdbd"
              lineBorderRadius="10px"
              label={<Typography variant="h6">Organization</Typography>}
              nodePadding="5px"
              pathFunc="straight"
            >
              {renderTree(orgTree)}
            </Tree>
          </Box>
        )}
      </Paper>
      
      {/* Person Form Dialog */}
      <PersonFormDialog 
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSavePerson}
        person={isNewPerson ? null : selectedNode}
        isNew={isNewPerson}
        defaultParentId={defaultParentId}
      />
    </Container>
  );
};

export default OrgTreePage; 