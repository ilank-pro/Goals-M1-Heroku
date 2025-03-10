import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  CircularProgress, 
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  CardActions,
  TextField,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { personApi, goalApi } from '../services/api';
import PersonFormDialog from '../components/PersonFormDialog';
import DocumentsSection from '../components/DocumentsSection';

const PersonDetailPage = () => {
  const { personId } = useParams();
  const navigate = useNavigate();
  
  const [person, setPerson] = useState(null);
  const [subordinates, setSubordinates] = useState([]);
  const [goals, setGoals] = useState([]);
  const [parentGoals, setParentGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [openPersonDialog, setOpenPersonDialog] = useState(false);
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isNewGoal, setIsNewGoal] = useState(true);
  
  // Goal form data
  const [goalFormData, setGoalFormData] = useState({
    name: '',
    definition: '',
    target: 0,
    current_value: 0,
    is_locked: false,
    is_private: false
  });
  
  // Fetch person data
  const fetchPersonData = async () => {
    try {
      setLoading(true);
      const personData = await personApi.getPerson(personId);
      setPerson(personData);
      
      // Fetch subordinates
      const subordinatesData = await personApi.getSubordinates(personId);
      setSubordinates(subordinatesData);
      
      // Fetch goals
      const goalsData = await goalApi.getPersonGoals(personId);
      setGoals(goalsData);
      
      // Fetch parent goals if person has a parent
      if (personData.parent_id) {
        const parentGoalsData = await goalApi.getParentGoals(personId);
        setParentGoals(parentGoalsData);
      } else {
        setParentGoals([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching person data:', err);
      setError('Failed to load person data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPersonData();
  }, [personId]);
  
  // Handle person edit
  const handleEditPerson = () => {
    setOpenPersonDialog(true);
  };
  
  const handleClosePersonDialog = () => {
    setOpenPersonDialog(false);
  };
  
  const handleSavePerson = async (personData) => {
    try {
      await personApi.updatePerson(personId, personData);
      fetchPersonData(); // Refresh data
      setOpenPersonDialog(false);
    } catch (err) {
      console.error('Error updating person:', err);
      setError('Failed to update person. Please try again.');
    }
  };
  
  // Handle goal operations
  const handleAddGoal = () => {
    setIsNewGoal(true);
    setSelectedGoal(null);
    setGoalFormData({
      name: '',
      definition: '',
      target: 0,
      current_value: 0,
      is_locked: false,
      is_private: false
    });
    setOpenGoalDialog(true);
  };
  
  const handleEditGoal = (goal) => {
    setIsNewGoal(false);
    setSelectedGoal(goal);
    setGoalFormData({
      name: goal.name,
      definition: goal.definition || '',
      target: goal.target,
      current_value: goal.current_value,
      is_locked: goal.is_locked,
      is_private: goal.is_private
    });
    setOpenGoalDialog(true);
  };
  
  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalApi.deleteGoal(goalId);
        fetchPersonData(); // Refresh data
      } catch (err) {
        console.error('Error deleting goal:', err);
        setError('Failed to delete goal. Please try again.');
      }
    }
  };
  
  const handleCloseGoalDialog = () => {
    setOpenGoalDialog(false);
  };
  
  const handleGoalFormChange = (e) => {
    const { name, value, checked } = e.target;
    setGoalFormData(prev => ({
      ...prev,
      [name]: name === 'is_locked' || name === 'is_private' ? checked : value
    }));
  };
  
  // Handle parent goal selection
  const handleParentGoalSelect = (event, selectedParentGoal) => {
    if (selectedParentGoal) {
      setGoalFormData(prev => ({
        ...prev,
        name: selectedParentGoal.name,
        definition: selectedParentGoal.definition || '',
        target: selectedParentGoal.target
      }));
    }
  };
  
  const handleSaveGoal = async () => {
    try {
      const goalData = {
        ...goalFormData,
        person_id: personId,
        target: parseFloat(goalFormData.target),
        current_value: parseFloat(goalFormData.current_value)
      };
      
      if (isNewGoal) {
        await goalApi.createGoal(goalData);
      } else {
        await goalApi.updateGoal(selectedGoal.id, goalData);
      }
      
      fetchPersonData(); // Refresh data
      setOpenGoalDialog(false);
    } catch (err) {
      console.error('Error saving goal:', err);
      setError('Failed to save goal. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Org Tree
          </Button>
        </Paper>
      </Container>
    );
  }
  
  if (!person) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography>Person not found</Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Back to Org Tree
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => {
            // Ensure the current person is still selected when returning to the tree
            try {
              // Save the current person ID as the selected node
              localStorage.setItem('org_tree_selected_node', personId);
              
              // Force a timestamp to ensure the tree view recognizes a change
              // Using a unique timestamp ensures the tree will re-render with the correct selection
              localStorage.setItem('org_tree_last_visit', Date.now().toString());
              
              // Also save expanded nodes state if available
              const expandedNodesStr = localStorage.getItem('org_tree_expanded_nodes');
              if (expandedNodesStr) {
                // Make sure we keep the expanded nodes state
                localStorage.setItem('org_tree_expanded_nodes', expandedNodesStr);
              }
            } catch (err) {
              console.error('Error saving selection state:', err);
            }
            
            // Navigate back to the tree view
            navigate('/');
          }}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {person.name}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />} 
          onClick={handleEditPerson}
        >
          Edit
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Person Details */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" gutterBottom>
              <strong>Position:</strong> {person.position}
            </Typography>
            
            {person.parent_id && (
              <Typography variant="body1" gutterBottom>
                <strong>Reports to:</strong> {/* Would need to fetch parent name */}
                <Button 
                  size="small" 
                  onClick={() => navigate(`/person/${person.parent_id}`)}
                >
                  View Manager
                </Button>
              </Typography>
            )}
            
            <Typography variant="body1" gutterBottom>
              <strong>Subordinates:</strong> {person.subordinates?.length || 0}
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>Goals:</strong> {goals.length}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Subordinates */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Subordinates
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {subordinates.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No subordinates found.
              </Typography>
            ) : (
              <List>
                {subordinates.map(sub => (
                  <ListItem 
                    key={sub.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => navigate(`/person/${sub.id}`)}>
                        <EditIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={sub.name} 
                      secondary={sub.position} 
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Goals */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Goals
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleAddGoal}
              >
                Add Goal
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {goals.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No goals found. Add a goal to get started.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {goals.map(goal => (
                  <Grid item xs={12} sm={6} md={4} key={goal.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {goal.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {goal.is_private && (
                              <LockIcon color="error" sx={{ mr: 1 }} />
                            )}
                            {goal.is_locked ? (
                              <LockIcon color="secondary" />
                            ) : (
                              <LockOpenIcon color="primary" />
                            )}
                          </Box>
                        </Box>
                        
                        {goal.definition && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {goal.definition}
                          </Typography>
                        )}
                        
                        <Typography variant="body1">
                          Progress: {goal.current_value} / {goal.target}
                        </Typography>
                        
                        <Box sx={{ mt: 1, width: '100%', height: 8, bgcolor: '#e0e0e0', borderRadius: 4 }}>
                          <Box 
                            sx={{ 
                              height: '100%', 
                              bgcolor: 'primary.main',
                              borderRadius: 4,
                              width: `${goal.target > 0 ? (goal.current_value / goal.target) * 100 : 0}%`,
                              maxWidth: '100%'
                            }} 
                          />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          startIcon={<EditIcon />}
                          onClick={() => handleEditGoal(goal)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Documents */}
        <Grid item xs={12}>
          <DocumentsSection personId={personId} />
        </Grid>
      </Grid>
      
      {/* Person Edit Dialog */}
      <PersonFormDialog 
        open={openPersonDialog}
        onClose={handleClosePersonDialog}
        onSave={handleSavePerson}
        person={person}
        isNew={false}
      />
      
      {/* Goal Dialog */}
      <Dialog open={openGoalDialog} onClose={handleCloseGoalDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isNewGoal ? 'Add New Goal' : 'Edit Goal'}
        </DialogTitle>
        <DialogContent>
          {isNewGoal && parentGoals.length > 0 && (
            <Autocomplete
              options={parentGoals}
              getOptionLabel={(option) => option.name}
              onChange={handleParentGoalSelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Select from parent's goals (optional)"
                  variant="outlined"
                  fullWidth
                  helperText="Select a parent goal or enter a new goal below"
                  sx={{ mb: 2 }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Target: {option.target} | Current: {option.current_value}
                    </Typography>
                  </Box>
                </li>
              )}
            />
          )}
          
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Goal Name"
            type="text"
            fullWidth
            variant="outlined"
            value={goalFormData.name}
            onChange={handleGoalFormChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="definition"
            label="Goal Definition"
            type="text"
            fullWidth
            variant="outlined"
            value={goalFormData.definition}
            onChange={handleGoalFormChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="target"
                label="Target Value"
                type="number"
                fullWidth
                variant="outlined"
                value={goalFormData.target}
                onChange={handleGoalFormChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                name="current_value"
                label="Current Value"
                type="number"
                fullWidth
                variant="outlined"
                value={goalFormData.current_value}
                onChange={handleGoalFormChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Switch
                checked={goalFormData.is_locked}
                onChange={handleGoalFormChange}
                name="is_locked"
                color="primary"
              />
            }
            label="Lock this goal (prevents automatic updates from subordinates)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={goalFormData.is_private}
                onChange={handleGoalFormChange}
                name="is_private"
                color="error"
              />
            }
            label="Private goal (will not propagate to parent nodes)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGoalDialog}>Cancel</Button>
          <Button onClick={handleSaveGoal} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PersonDetailPage; 