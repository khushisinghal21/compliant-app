'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Fade,
  Grow
} from '@mui/material';
import {
  Report as ReportIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  PriorityHigh as PriorityIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/lib/api';
import FileUpload from './FileUpload';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Support',
    priority: 'Medium'
  });
  const [attachments, setAttachments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { accessToken } = useAuth();
  const { call: apiCall } = useApi();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) {
      return; // Prevent multiple submissions
    }
    
    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await apiCall('/api/complaints', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          attachments
        }),
      });

      if (response.error || (response.status !== 200 && response.status !== 201)) {
        throw new Error(response.error || 'Failed to submit complaint');
      }

      setSuccess(true);
      setError(''); // Clear any existing errors
      setFormData({
        title: '',
        description: '',
        category: 'Support',
        priority: 'Medium'
      });
      setAttachments([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            }}
          >
            <ReportIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Submit Your Complaint
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please provide detailed information to help us resolve your issue quickly
          </Typography>
        </Box>
      
              <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Complaint Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            margin="normal"
            required
            variant="outlined"
            placeholder="Brief description of your complaint"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ReportIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            margin="normal"
            required
            variant="outlined"
            multiline
            rows={4}
            placeholder="Please provide detailed information about your complaint"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleInputChange('category', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="Product">Product</MenuItem>
                <MenuItem value="Service">Service</MenuItem>
                <MenuItem value="Support">Support</MenuItem>
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Billing">Billing</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ minWidth: 200 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => handleInputChange('priority', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <PriorityIcon color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* File Upload Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Attachments (Optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add screenshots, documents, or other files to support your complaint
            </Typography>
            <FileUpload onFilesUploaded={setAttachments} />
          </Box>

          <Grow in timeout={1000}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Submitting...
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SendIcon />
                  Submit Complaint
                </Box>
              )}
            </Button>
          </Grow>
        </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Complaint submitted successfully! We'll review it and get back to you soon.
        </Alert>
      </Snackbar>

              <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert
            onClose={() => setError('')}
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Fade>
  );
} 