import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress 
} from '@mui/material';
import { personApi } from '../services/api';

const PersonFormDialog = ({ open, onClose, onSave, person, isNew, defaultParentId }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    parent_id: ''
  });
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch all persons for parent selection
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        setLoading(true);
        const data = await personApi.getAllPersons();
        setPersons(data);
      } catch (err) {
        console.error('Error fetching persons:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      fetchPersons();
    }
  }, [open]);
  
  // Set form data when editing an existing person or creating a new one with a default parent
  useEffect(() => {
    if (person && !isNew) {
      // Editing existing person
      setFormData({
        name: person.name || '',
        position: person.position || '',
        parent_id: person.parent_id || ''
      });
    } else {
      // Creating new person
      setFormData({
        name: '',
        position: '',
        parent_id: defaultParentId || ''
      });
    }
  }, [person, isNew, defaultParentId, open]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isNew ? 'Add New Person' : 'Edit Person'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="position"
            label="Position"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.position}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="parent-select-label">Manager/Parent</InputLabel>
            <Select
              labelId="parent-select-label"
              name="parent_id"
              value={formData.parent_id}
              onChange={handleChange}
              label="Manager/Parent"
            >
              <MenuItem value="">
                <em>None (Top Level)</em>
              </MenuItem>
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                persons
                  .filter(p => p.id !== (person ? person.id : null)) // Exclude self when editing
                  .map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} ({p.position})
                    </MenuItem>
                  ))
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PersonFormDialog; 