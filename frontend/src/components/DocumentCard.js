import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, CardActions, Button } from '@mui/material';
import { Lock, LockOpen, Delete, Edit } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const DocumentCard = ({ document, onDelete, onTogglePrivacy, onEdit }) => {
  const theme = useTheme();

  const handleClick = () => {
    window.open(document.link, '_blank');
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div" gutterBottom>
            {document.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {document.is_private && (
              <Lock color="error" sx={{ mr: 1 }} />
            )}
            {document.is_private ? (
              <Lock color="primary" />
            ) : (
              <LockOpen color="primary" />
            )}
          </Box>
        </Box>
        {document.description && (
          <Typography variant="body2" color="text.secondary">
            {document.description}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          startIcon={<Edit />}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(document);
          }}
        >
          Edit
        </Button>
        <Button 
          size="small" 
          color="error" 
          startIcon={<Delete />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(document.id);
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default DocumentCard; 