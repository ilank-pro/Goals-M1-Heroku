import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DocumentCard from './DocumentCard';
import DocumentForm from './DocumentForm';
import api from '../services/api';

const DocumentsSection = ({ personId }) => {
  const [documents, setDocuments] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);

  const fetchDocuments = async () => {
    try {
      const response = await api.get(`/documents/person/${personId}`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [personId]);

  const handleAddDocument = async (documentData) => {
    try {
      const response = await api.post('/documents/', documentData);
      setDocuments([...documents, response.data]);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleEditDocument = async (documentData) => {
    try {
      const response = await api.put(`/documents/${editingDocument.id}`, documentData);
      setDocuments(documents.map(doc => 
        doc.id === editingDocument.id ? response.data : doc
      ));
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await api.delete(`/documents/${documentId}`);
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleTogglePrivacy = async (documentId, isPrivate) => {
    try {
      await api.put(`/documents/${documentId}`, { is_private: isPrivate });
      setDocuments(documents.map(doc => 
        doc.id === documentId ? { ...doc, is_private: isPrivate } : doc
      ));
    } catch (error) {
      console.error('Error toggling document privacy:', error);
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingDocument(null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Documents
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpenForm(true)}
        >
          Add Document
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      {documents.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No documents found. Add a document to get started.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {documents.map((document) => (
            <Grid item xs={12} sm={6} md={4} key={document.id}>
              <DocumentCard
                document={document}
                onDelete={handleDeleteDocument}
                onTogglePrivacy={handleTogglePrivacy}
                onEdit={handleEdit}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <DocumentForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={editingDocument ? handleEditDocument : handleAddDocument}
        personId={personId}
        document={editingDocument}
      />
    </Paper>
  );
};

export default DocumentsSection; 