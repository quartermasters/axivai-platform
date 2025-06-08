import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Slider
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Warning,
  Refresh,
  Cancel,
  Download,
  Visibility,
  Flag,
  Lightbulb
} from '@mui/icons-material';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface EvaluationResult {
  evaluation_id: string;
  verdict: string;
  overall_score: number;
  agent_scores: Record<string, number>;
  detailed_scores: Array<{
    agent_name: string;
    score: number;
    confidence: number;
    reasoning: string;
    red_flags: string[];
    recommendations: string[];
  }>;
  explanation: string;
  recommendations: string[];
  timestamp: string;
}

const Results: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [explainabilityLevel, setExplainabilityLevel] = useState(50);

  useEffect(() => {
    // Mock result data - replace with API call
    setTimeout(() => {
      setResult({
        evaluation_id: evaluationId || '1',
        verdict: 'validate',
        overall_score: 0.78,
        agent_scores: {
          idea_hunter: 0.85,
          market_miner: 0.72,
          model_judge: 0.80,
          risk_oracle: 0.65,
          valuator_x: 0.88
        },
        detailed_scores: [
          {
            agent_name: 'idea_hunter',
            score: 0.85,
            confidence: 0.90,
            reasoning: 'Strong technical feasibility with clear market timing. Solution addresses real pain point.',
            red_flags: [],
            recommendations: ['Validate technical assumptions with prototype', 'Conduct user interviews']
          },
          {
            agent_name: 'market_miner',
            score: 0.72,
            confidence: 0.75,
            reasoning: 'Large addressable market ($50B TAM) but competitive landscape is crowded.',
            red_flags: ['Highly saturated market'],
            recommendations: ['Develop stronger differentiation strategy', 'Focus on niche market entry']
          },
          {
            agent_name: 'model_judge',
            score: 0.80,
            confidence: 0.85,
            reasoning: 'SaaS model shows strong recurring revenue potential with good scalability.',
            red_flags: [],
            recommendations: ['Track and optimize Monthly Recurring Revenue (MRR)', 'Focus on customer retention']
          },
          {
            agent_name: 'risk_oracle',
            score: 0.65,
            confidence: 0.70,
            reasoning: 'Moderate risk profile with some technical complexity concerns.',
            red_flags: ['High technical complexity risk'],
            recommendations: ['Build technical proof-of-concept', 'Mitigate key technical risks early']
          },
          {
            agent_name: 'valuator_x',
            score: 0.88,
            confidence: 0.60,
            reasoning: 'Valuation expectations align well with stage and traction metrics.',
            red_flags: [],
            recommendations: ['Track key valuation metrics', 'Research comparable company valuations']
          }
        ],
        explanation: 'Based on stage 3 evaluation, your startup scored 78% overall. Key strengths include strong idea feasibility and business model viability.',
        recommendations: [
          'Build technical prototype to validate core assumptions',
          'Develop clearer market differentiation strategy',
          'Focus on customer acquisition and retention metrics',
          'Implement comprehensive financial tracking',
          'Conduct competitive analysis and positioning'
        ],
        timestamp: '2025-06-08T10:30:00Z'
      });
      setLoading(false);
    }, 1000);
  }, [evaluationId]);

  const getVerdictDetails = (verdict: string) => {
    switch (verdict) {
      case 'validate':
        return {
          icon: <CheckCircle color="success" />,
          color: 'success',
          title: '✅ Validate',
          description: 'Strong potential - proceed with development and funding'
        };
      case 'conditional':
        return {
          icon: <Warning color="warning" />,
          color: 'warning', 
          title: '⚠️ Conditional',
          description: 'Promising but needs addressing key concerns before proceeding'
        };
      case 'pivot':
        return {
          icon: <Refresh color="info" />,
          color: 'info',
          title: '🔁 Pivot',
          description: 'Consider significant changes to business model or approach'
        };
      case 'invalid':
        return {
          icon: <Cancel color="error" />,
          color: 'error',
          title: '❌ Invalid',
          description: 'High risk - fundamental issues need resolution'
        };
      default:
        return {
          icon: <Warning />,
          color: 'default',
          title: 'Unknown',
          description: 'Unable to determine verdict'
        };
    }
  };

  const agentDisplayNames = {
    idea_hunter: 'Idea Hunter',
    market_miner: 'Market Miner',
    model_judge: 'Model Judge',
    risk_oracle: 'Risk Oracle',
    valuator_x: 'Valuator X'
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Analyzing evaluation results...</Typography>
      </Container>
    );
  }

  if (!result) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Evaluation result not found</Alert>
      </Container>
    );
  }

  const verdictDetails = getVerdictDetails(result.verdict);
  const chartData = Object.entries(result.agent_scores).map(([agent, score]) => ({
    name: agentDisplayNames[agent as keyof typeof agentDisplayNames] || agent,
    score: Math.round(score * 100),
    fill: '#1976d2'
  }));

  const overallData = [{
    name: 'Overall Score',
    score: Math.round(result.overall_score * 100),
    fill: verdictDetails.color === 'success' ? '#4caf50' : 
          verdictDetails.color === 'warning' ? '#ff9800' :
          verdictDetails.color === 'info' ? '#2196f3' : '#f44336'
  }];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Evaluation Results</Typography>
        <Box>
          <Button startIcon={<Download />} sx={{ mr: 2 }}>
            Download PDF
          </Button>
          <Button startIcon={<Visibility />} variant="outlined">
            Share Results
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Verdict Card */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {verdictDetails.icon}
                <Typography variant="h5" sx={{ ml: 2 }}>
                  {verdictDetails.title}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Chip 
                  label={`${Math.round(result.overall_score * 100)}% Score`}
                  color={verdictDetails.color as any}
                  size="large"
                />
              </Box>
              <Typography variant="body1" color="text.secondary">
                {verdictDetails.description}
              </Typography>
              <Typography sx={{ mt: 2 }}>
                {result.explanation}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Overall Score Visualization */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overall Score
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart data={overallData}>
                <RadialBar 
                  dataKey="score" 
                  cornerRadius={10}
                  fill={overallData[0].fill}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <Typography align="center" variant="h4">
              {Math.round(result.overall_score * 100)}%
            </Typography>
          </Paper>
        </Grid>

        {/* Agent Scores */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Agent Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="horizontal">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Bar dataKey="score" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Explainability Control */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Explainability Level
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={explainabilityLevel}
                onChange={(_, value) => setExplainabilityLevel(value as number)}
                marks={[
                  { value: 0, label: 'Summary' },
                  { value: 50, label: 'Detailed' },
                  { value: 100, label: 'Full Audit' }
                ]}
                sx={{ mb: 2 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Agent Analysis */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Detailed Agent Analysis
          </Typography>
          {result.detailed_scores.map((agent) => (
            <Accordion key={agent.agent_name} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ flexGrow: 1 }}>
                    {agentDisplayNames[agent.agent_name as keyof typeof agentDisplayNames]}
                  </Typography>
                  <Chip 
                    label={`${Math.round(agent.score * 100)}%`}
                    color={agent.score >= 0.7 ? 'success' : agent.score >= 0.5 ? 'warning' : 'error'}
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(agent.confidence * 100)}% confidence
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph>
                  {agent.reasoning}
                </Typography>
                
                {agent.red_flags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      <Flag sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Red Flags
                    </Typography>
                    <List dense>
                      {agent.red_flags.map((flag, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Warning color="error" />
                          </ListItemIcon>
                          <ListItemText primary={flag} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                
                {agent.recommendations.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      <Lightbulb sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Recommendations
                    </Typography>
                    <List dense>
                      {agent.recommendations.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Lightbulb color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        {/* Top Recommendations */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Recommendations
            </Typography>
            <List>
              {result.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Lightbulb color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Results;