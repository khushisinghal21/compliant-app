'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/lib/api';
import ComplaintTable from './ComplaintTable';

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dateSubmitted: string;
  submittedBy: {
    name: string;
    email: string;
  };
}

export default function FilterBar() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { accessToken } = useAuth();
  const { call: apiCall } = useApi();

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter complaints when filters change
  useEffect(() => {
    let filtered = complaints;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    if (priorityFilter !== 'All') {
      filtered = filtered.filter(complaint => complaint.priority === priorityFilter);
    }

    setFilteredComplaints(filtered);
  }, [complaints, statusFilter, priorityFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/api/complaints');

      if (response.error || response.status !== 200) {
        throw new Error(response.error || 'Failed to fetch complaints');
      }
      
      setComplaints(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load complaints. Please try again.');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await apiCall(`/api/complaints/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      if (response.error || response.status !== 200) {
        throw new Error(response.error || 'Failed to update status');
      }

      // Update the complaint in the local state
      setComplaints(prev => 
        prev.map(complaint => 
          complaint._id === id 
            ? { ...complaint, status } 
            : complaint
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await apiCall(`/api/complaints/${id}`, {
        method: 'DELETE',
      });

      if (response.error || response.status !== 200) {
        throw new Error(response.error || 'Failed to delete complaint');
      }

      // Remove the complaint from the local state
      setComplaints(prev => prev.filter(complaint => complaint._id !== id));
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
  };

  const handleRefresh = () => {
    fetchComplaints();
  };

  return (
    <Box sx={{ mb: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center', 
        flexWrap: 'wrap',
        mb: 2
      }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Filters:
        </Typography>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>

        <Button 
          variant="outlined" 
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>

        <Typography variant="body2" color="text.secondary">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </Typography>
      </Box>

      {/* Pass the filtered complaints and handlers to ComplaintTable */}
      <ComplaintTable
        complaints={filteredComplaints}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
      />
    </Box>
  );
} 