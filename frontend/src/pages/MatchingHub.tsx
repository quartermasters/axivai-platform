import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Avatar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  Business,
  LocationOn,
  AttachMoney,
  Bookmark,
  BookmarkBorder,
  Visibility
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface StartupMatch {
  id: string;
  name: string;
  description: string;
  stage: number;
  domain: string;
  location: string;
  match_score: number;
  valuation: string;
  highlights: string[];
  bookmarked: boolean;
}

interface InvestorMatch {
  id: string;
  name: string;
  type: string;
  focus_stages: number[];
  domains: string[];
  typical_check: string;
  portfolio_count: number;
  match_score: number;
  bookmarked: boolean;
}

const MatchingHub: React.FC = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [startupMatches, setStartupMatches] = useState<StartupMatch[]>([]);
  const [investorMatches, setInvestorMatches] = useState<InvestorMatch[]>([]);
  const [filters, setFilters] = useState({
    stage: '',
    domain: '',
    location: '',
    minScore: 0
  });

  useEffect(() => {
    // Mock data - replace with API calls
    setStartupMatches([
      {
        id: '1',
        name: 'TechFlow AI',
        description: 'AI-powered workflow automation for enterprises',
        stage: 3,
        domain: 'Enterprise SaaS',
        location: 'San Francisco, CA',
        match_score: 0.92,
        valuation: '$15M',
        highlights: ['Strong product-market fit', 'Experienced team', 'Growing revenue'],
        bookmarked: false
      },
      {
        id: '2',
        name: 'GreenLogistics',
        description: 'Sustainable supply chain optimization platform',
        stage: 4,
        domain: 'Supply Chain',
        location: 'Austin, TX',
        match_score: 0.87,
        valuation: '$30M',
        highlights: ['ESG focus', 'Proven traction', 'Strong partnerships'],
        bookmarked: true
      },
      {
        id: '3',
        name: 'HealthConnect',
        description: 'Telemedicine platform for rural healthcare',
        stage: 2,
        domain: 'HealthTech',
        location: 'Denver, CO',
        match_score: 0.81,
        valuation: '$8M',
        highlights: ['Social impact', 'Government partnerships', 'Growing market'],
        bookmarked: false
      }
    ]);

    setInvestorMatches([
      {
        id: '1',
        name: 'Nexus Ventures',
        type: 'VC',
        focus_stages: [3, 4, 5],
        domains: ['Enterprise SaaS', 'AI/ML'],
        typical_check: '$2M - $10M',
        portfolio_count: 45,
        match_score: 0.89,
        bookmarked: false
      },
      {
        id: '2', 
        name: 'Green Capital Partners',
        type: 'Impact VC',
        focus_stages: [3, 4],
        domains: ['CleanTech', 'Supply Chain'],
        typical_check: '$5M - $15M',
        portfolio_count: 32,
        match_score: 0.84,
        bookmarked: true
      }
    ]);
  }, []);

  const handleBookmark = (id: string, type: 'startup' | 'investor') => {
    if (type === 'startup') {
      setStartupMatches(prev => 
        prev.map(item => 
          item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
        )
      );
    } else {
      setInvestorMatches(prev =>
        prev.map(item =>
          item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
        )
      );
    }
  };

  const getStageLabel = (stage: number) => {
    const stages = {
      1: 'Ideation',
      2: 'Validation', 
      3: 'Early Traction',
      4: 'Growth',
      5: 'Expansion',
      6: 'Maturity',
      7: 'Decline/Pivot',
      8: 'Exit Prep'
    };
    return stages[stage as keyof typeof stages] || `Stage ${stage}`;
  };

  const renderStartupCard = (startup: StartupMatch) => (
    <Card key={startup.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {startup.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {startup.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${Math.round(startup.match_score * 100)}% match`}
              color="primary"
              size="small"
            />
            <IconButton 
              onClick={() => handleBookmark(startup.id, 'startup')}
              color={startup.bookmarked ? 'primary' : 'default'}
            >
              {startup.bookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendingUp fontSize="small" />
            <Typography variant="body2">{getStageLabel(startup.stage)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Business fontSize="small" />
            <Typography variant="body2">{startup.domain}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn fontSize="small" />
            <Typography variant="body2">{startup.location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AttachMoney fontSize="small" />
            <Typography variant="body2">Valuation: {startup.valuation}</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          {startup.highlights.map((highlight, index) => (
            <Chip 
              key={index}
              label={highlight}
              size="small"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" startIcon={<Visibility />}>
            View Details
          </Button>
          <Button variant="outlined" size="small">
            Request Intro
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderInvestorCard = (investor: InvestorMatch) => (
    <Card key={investor.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {investor.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {investor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {investor.type} • {investor.portfolio_count} portfolio companies
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${Math.round(investor.match_score * 100)}% match`}
              color="primary"
              size="small"
            />
            <IconButton 
              onClick={() => handleBookmark(investor.id, 'investor')}
              color={investor.bookmarked ? 'primary' : 'default'}
            >
              {investor.bookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Focus Stages:</strong> {investor.focus_stages.map(s => getStageLabel(s)).join(', ')}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Domains:</strong> {investor.domains.join(', ')}
          </Typography>
          <Typography variant="body2">
            <strong>Typical Check:</strong> {investor.typical_check}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small">
            View Profile
          </Button>
          <Button variant="outlined" size="small">
            Request Meeting
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {user?.user_type === 'investor' ? 'Startup' : 'Investor'} Matching Hub
      </Typography>

      <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={user?.user_type === 'investor' ? 'Startup Matches' : 'Investor Matches'} />
        <Tab label="Bookmarked" />
        <Tab label="Recent Activity" />
      </Tabs>

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Stage</InputLabel>
              <Select
                value={filters.stage}
                label="Stage"
                onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
              >
                <MenuItem value="">All Stages</MenuItem>
                <MenuItem value="2">Validation</MenuItem>
                <MenuItem value="3">Early Traction</MenuItem>
                <MenuItem value="4">Growth</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Domain"
              value={filters.domain}
              onChange={(e) => setFilters(prev => ({ ...prev, domain: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Location"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              sx={{ mb: 2 }}
            />

            <Typography gutterBottom>Minimum Match Score</Typography>
            <Rating
              value={filters.minScore / 20}
              onChange={(_, value) => setFilters(prev => ({ ...prev, minScore: (value || 0) * 20 }))}
              max={5}
            />
          </Card>
        </Grid>

        {/* Matches */}
        <Grid item xs={12} md={9}>
          {currentTab === 0 && (
            <Box>
              {user?.user_type === 'investor' ? (
                <Box>
                  {startupMatches.map(renderStartupCard)}
                </Box>
              ) : (
                <Box>
                  {investorMatches.map(renderInvestorCard)}
                </Box>
              )}
            </Box>
          )}

          {currentTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Bookmarked {user?.user_type === 'investor' ? 'Startups' : 'Investors'}
              </Typography>
              {user?.user_type === 'investor' ? (
                <Box>
                  {startupMatches.filter(s => s.bookmarked).map(renderStartupCard)}
                </Box>
              ) : (
                <Box>
                  {investorMatches.filter(i => i.bookmarked).map(renderInvestorCard)}
                </Box>
              )}
            </Box>
          )}

          {currentTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>T</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="TechFlow AI viewed your profile"
                    secondary="2 hours ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>G</Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="New match: Green Capital Partners"
                    secondary="1 day ago"
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MatchingHub;