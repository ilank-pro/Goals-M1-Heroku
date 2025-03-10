import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box
} from '@mui/material';

const DocumentForm = ({ open, onClose, onSubmit, personId, document }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    is_private: false
  });

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        description: document.description || '',
        link: document.link,
        is_private: document.is_private
      });
    } else {
      setFormData({
        title: '',
        description: '',
        link: '',
        is_private: false
      });
    }
  }, [document, open]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'is_private' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        person_id: personId
      });
      onClose();
    } catch (error) {
      console.error('Error submitting document:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{document ? 'Edit Document' : 'Add New Document'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="title"
              label="Document Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              name="link"
              label="Document Link"
              value={formData.link}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  name="is_private"
                  checked={formData.is_private}
                  onChange={handleChange}
                />
              }
              label="Private Document"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {document ? 'Save Changes' : 'Add Document'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DocumentForm; 