'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Box, 
  Typography, 
  Paper,
  Fade,
  Slide,
  Grow
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

import FilterBar from '@/components/FilterBar';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth');
      } else if (user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  mb: 2,
                }}
              >
                Admin Dashboard
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  opacity: 0.9,
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  mb: 3,
                }}
              >
                Manage and track all complaints from users efficiently
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Box sx={{ py: 6 }}>
          {/* Admin Features Section */}
          <Fade in timeout={1200}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                align="center"
                sx={{ fontWeight: 600, mb: 4 }}
              >
                Admin Capabilities
              </Typography>
              
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                  gap: 3,
                  mb: 6,
                }}
              >
                {[
                  {
                    icon: <DashboardIcon sx={{ fontSize: 40 }} />,
                    title: 'Dashboard Overview',
                    desc: 'Comprehensive view of all complaints and metrics'
                  },
                  {
                    icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
                    title: 'Advanced Analytics',
                    desc: 'Track trends and performance indicators'
                  },
                  {
                    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
                    title: 'Secure Access',
                    desc: 'Role-based authentication and permissions'
                  },
                  {
                    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
                    title: 'Quick Actions',
                    desc: 'Efficient complaint management tools'
                  }
                ].map((feature, index) => (
                  <Grow in timeout={1400 + index * 200} key={index}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 3,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
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
                          color: 'white',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.desc}
                      </Typography>
                    </Paper>
                  </Grow>
                ))}
              </Box>
            </Box>
          </Fade>

          {/* Complaint Management Section */}
          <Slide direction="up" in timeout={1600}>
            <Box>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                align="center"
                sx={{ fontWeight: 600, mb: 4 }}
              >
                Complaint Management
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
              >
                View, filter, and manage all user complaints. Update status, respond to users, 
                and track resolution progress.
              </Typography>
              
              <FilterBar />
            </Box>
          </Slide>
        </Box>
      </Container>
    </>
  );
} 