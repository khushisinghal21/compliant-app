'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Card,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/lib/api';
import Navigation from '@/components/Navigation';

interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dateSubmitted: string;
  attachments?: Array<{
    originalName: string;
    filename: string;
    mimetype: string;
    size: number;
    url: string;
    thumbnailUrl?: string;
    processedUrl?: string;
  }>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { call: apiCall } = useApi();

  useEffect(() => {
    if (user) {
      fetchUserComplaints();
    }
  }, [user]);

  const fetchUserComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiCall('/api/complaints');

      if (response.error || response.status !== 200) {
        throw new Error(response.error || 'Failed to fetch complaints');
      }

      setComplaints(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load your complaints. Please try again.';
      setError(errorMessage);
      console.error('Error fetching user complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setDetailDialogOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Progress': return 'info';
      case 'Resolved': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <ScheduleIcon />;
      case 'In Progress': return <TrendingUpIcon />;
      case 'Resolved': return <CheckCircleIcon />;
      default: return <ErrorIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredComplaints = () => {
    switch (tabValue) {
      case 0: // All
        return complaints;
      case 1: // Pending
        return complaints.filter(c => c.status === 'Pending');
      case 2: // In Progress
        return complaints.filter(c => c.status === 'In Progress');
      case 3: // Resolved
        return complaints.filter(c => c.status === 'Resolved');
      default:
        return complaints;
    }
  };

  const filteredComplaints = getFilteredComplaints();

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h6" color="text.secondary">
          Please log in to view your dashboard.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
            <DashboardIcon sx={{ fontSize: 32 }} />
            My Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.name}! Track your complaints and their current status.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Card sx={{ textAlign: 'center', p: 2, flex: '1 1 200px', minWidth: 200 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Complaints
            </Typography>
          </Card>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50', flex: '1 1 200px', minWidth: 200 }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Card>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50', flex: '1 1 200px', minWidth: 200 }}>
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
              {stats.inProgress}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Card>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', flex: '1 1 200px', minWidth: 200 }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
              {stats.resolved}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resolved
            </Typography>
          </Card>
        </Box>

        {/* Complaints Section */}
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="complaint status tabs">
              <Tab label={`All (${stats.total})`} />
              <Tab label={`Pending (${stats.pending})`} />
              <Tab label={`In Progress (${stats.inProgress})`} />
              <Tab label={`Resolved (${stats.resolved})`} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <ComplaintsList complaints={filteredComplaints} onViewDetails={handleViewDetails} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ComplaintsList complaints={filteredComplaints} onViewDetails={handleViewDetails} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <ComplaintsList complaints={filteredComplaints} onViewDetails={handleViewDetails} />
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <ComplaintsList complaints={filteredComplaints} onViewDetails={handleViewDetails} />
          </TabPanel>
        </Paper>

        {/* Refresh Button */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUserComplaints}
            disabled={loading}
          >
            Refresh Complaints
          </Button>
        </Box>
      </Container>

      {/* Complaint Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h6" gutterBottom>
                {selectedComplaint.title}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Submitted on: {formatDate(selectedComplaint.dateSubmitted)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip 
                  label={selectedComplaint.category} 
                  variant="outlined"
                />
                <Chip 
                  label={selectedComplaint.priority} 
                  color={getPriorityColor(selectedComplaint.priority) as any}
                />
                <Chip 
                  label={selectedComplaint.status} 
                  color={getStatusColor(selectedComplaint.status) as any}
                  icon={getStatusIcon(selectedComplaint.status)}
                />
              </Box>

              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                {selectedComplaint.description}
              </Typography>

              {/* Attachments Section */}
              {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Attachments ({selectedComplaint.attachments.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedComplaint.attachments.map((attachment, index) => (
                      <Chip
                        key={index}
                        label={attachment.originalName}
                        variant="outlined"
                        size="small"
                        onClick={() => window.open(attachment.url, '_blank')}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Complaints List Component
function ComplaintsList({ 
  complaints, 
  onViewDetails 
}: { 
  complaints: Complaint[]; 
  onViewDetails: (complaint: Complaint) => void;
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Progress': return 'info';
      case 'Resolved': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (complaints.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No complaints found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {complaints.length === 0 ? 'You haven\'t submitted any complaints yet.' : 'No complaints match the selected filter.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {complaints.map((complaint) => (
        <Card key={complaint._id} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {complaint.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {complaint.description.length > 100 
                  ? `${complaint.description.substring(0, 100)}...` 
                  : complaint.description
                }
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={complaint.category} 
                  size="small"
                  variant="outlined"
                />
                <Chip 
                  label={complaint.priority} 
                  color={getPriorityColor(complaint.priority) as any}
                  size="small"
                />
                <Chip 
                  label={complaint.status} 
                  color={getStatusColor(complaint.status) as any}
                  size="small"
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Submitted: {formatDate(complaint.dateSubmitted)}
              </Typography>
              {complaint.attachments && complaint.attachments.length > 0 && (
                <Typography variant="caption" color="primary" sx={{ ml: 2 }}>
                  {complaint.attachments.length} attachment(s)
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={() => onViewDetails(complaint)}
              color="primary"
              size="small"
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
        </Card>
      ))}
    </Box>
  );
} 