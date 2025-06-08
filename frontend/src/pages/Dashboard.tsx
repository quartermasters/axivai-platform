import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import { Assessment, TrendingUp, History, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardData {
  evaluations_count: number;
  recent_evaluations: Array<{
    id: string;
    company_name: string;
    verdict: string;
    score: number;
    timestamp: string;
  }>;
  usage_stats: {
    reports_this_month: number;
    tier: string;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock dashboard data - replace with API call
    setTimeout(() => {
      setDashboardData({
        evaluations_count: 7,
        recent_evaluations: [
          {
            id: '1',
            company_name: 'TechFlow AI',
            verdict: 'validate',
            score: 0.82,
            timestamp: '2025-06-07T10:30:00Z'
          },
          {
            id: '2', 
            company_name: 'GreenLogistics',
            verdict: 'conditional',
            score: 0.67,
            timestamp: '2025-06-06T15:20:00Z'
          },
          {
            id: '3',
            company_name: 'HealthConnect',
            verdict: 'pivot',
            score: 0.45,
            timestamp: '2025-06-05T09:15:00Z'
          }
        ],
        usage_stats: {
          reports_this_month: 3,
          tier: user?.tier || 'free'
        }
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'validate': return 'success';
      case 'conditional': return 'warning';
      case 'pivot': return 'info';
      case 'invalid': return 'error';
      default: return 'default';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'validate': return '✅';
      case 'conditional': return '⚠️';
      case 'pivot': return '🔁';
      case 'invalid': return '❌';
      default: return '❓';
    }
  };

  const chartData = dashboardData?.recent_evaluations.map(eval => ({
    name: eval.company_name.substring(0, 10),
    score: Math.round(eval.score * 100)
  })) || [];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Welcome back, {user?.email.split('@')[0]}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/evaluate')}
          size="large"
        >
          New Evaluation
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Evaluations
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.evaluations_count || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    This Month
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.usage_stats.reports_this_month || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  {user?.tier?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Current Tier
                  </Typography>
                  <Typography variant="h6">
                    {dashboardData?.usage_stats.tier?.toUpperCase() || 'FREE'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <History color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Reports Left
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData?.usage_stats.tier === 'free' ? 
                      Math.max(0, 3 - (dashboardData?.usage_stats.reports_this_month || 0)) : 
                      '∞'
                    }
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Evaluations Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Evaluation Scores
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Bar dataKey="score" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Evaluations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Evaluations
            </Typography>
            <List>
              {dashboardData?.recent_evaluations.map((evaluation) => (
                <ListItem 
                  key={evaluation.id}
                  onClick={() => navigate(`/results/${evaluation.id}`)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{getVerdictIcon(evaluation.verdict)}</span>
                        <Typography variant="subtitle2">
                          {evaluation.company_name}
                        </Typography>
                        <Chip 
                          label={`${Math.round(evaluation.score * 100)}%`} 
                          size="small"
                          color={getVerdictColor(evaluation.verdict) as any}
                        />
                      </Box>
                    }
                    secondary={new Date(evaluation.timestamp).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
            
            {dashboardData?.recent_evaluations.length === 0 && (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                No evaluations yet. Start by evaluating your first startup!
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Usage Warning */}
        {dashboardData?.usage_stats.tier === 'free' && 
         (dashboardData?.usage_stats.reports_this_month || 0) >= 2 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: 'warning.light' }}>
              <Typography variant="h6" gutterBottom>
                Approaching Usage Limit
              </Typography>
              <Typography>
                You've used {dashboardData?.usage_stats.reports_this_month} of 3 free reports this month. 
                Upgrade to Pro for unlimited evaluations.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Upgrade Now
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;