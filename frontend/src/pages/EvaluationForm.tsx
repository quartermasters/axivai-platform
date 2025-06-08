import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Slider,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Send, Upload } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const steps = ['Basic Info', 'Business Details', 'Financials', 'Submit'];

const EvaluationForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    company_name: '',
    stage: 3,
    description: '',
    market_size: '',
    business_model: '',
    team_info: '',
    financials: {
      revenue: '',
      users: '',
      growth_rate: '',
      burn_rate: ''
    },
    privacy_mode: true
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxFiles: 1,
    onDrop: (files) => {
      // Handle file upload
      console.log('Files uploaded:', files);
    }
  });

  const handleInputChange = (field: string) => (event: any) => {
    if (field.startsWith('financials.')) {
      const financialField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        financials: {
          ...prev.financials,
          [financialField]: event.target.value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    }
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/validate/startup', formData);
      navigate(`/results/${response.data.evaluation_id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Evaluation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Company Name"
              value={formData.company_name}
              onChange={handleInputChange('company_name')}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Lifecycle Stage</InputLabel>
              <Select
                value={formData.stage}
                onChange={handleInputChange('stage')}
                label="Lifecycle Stage"
              >
                <MenuItem value={1}>1 - Ideation</MenuItem>
                <MenuItem value={2}>2 - Validation</MenuItem>
                <MenuItem value={3}>3 - Early Traction</MenuItem>
                <MenuItem value={4}>4 - Growth</MenuItem>
                <MenuItem value={5}>5 - Expansion</MenuItem>
                <MenuItem value={6}>6 - Maturity</MenuItem>
                <MenuItem value={7}>7 - Decline/Pivot</MenuItem>
                <MenuItem value={8}>8 - Exit Prep</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Company Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Describe your startup, what problem it solves, and your solution..."
              required
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Market Size (TAM/SAM/SOM)"
              value={formData.market_size}
              onChange={handleInputChange('market_size')}
              placeholder="e.g., $50B TAM, $5B SAM, $500M SOM"
            />
            
            <TextField
              fullWidth
              label="Business Model"
              multiline
              rows={3}
              value={formData.business_model}
              onChange={handleInputChange('business_model')}
              placeholder="How do you make money? Subscription, marketplace, freemium..."
            />

            <TextField
              fullWidth
              label="Team Information"
              multiline
              rows={3}
              value={formData.team_info}
              onChange={handleInputChange('team_info')}
              placeholder="Key team members, their backgrounds, and relevant experience..."
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Metrics (Optional)
            </Typography>
            
            <TextField
              fullWidth
              label="Annual Revenue ($)"
              type="number"
              value={formData.financials.revenue}
              onChange={handleInputChange('financials.revenue')}
              placeholder="0"
            />
            
            <TextField
              fullWidth
              label="Total Users/Customers"
              type="number"
              value={formData.financials.users}
              onChange={handleInputChange('financials.users')}
              placeholder="0"
            />
            
            <TextField
              fullWidth
              label="Monthly Growth Rate (%)"
              type="number"
              value={formData.financials.growth_rate}
              onChange={handleInputChange('financials.growth_rate')}
              placeholder="5"
            />
            
            <TextField
              fullWidth
              label="Monthly Burn Rate ($)"
              type="number"
              value={formData.financials.burn_rate}
              onChange={handleInputChange('financials.burn_rate')}
              placeholder="10000"
            />
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Pitch Deck (Optional)
            </Typography>
            
            <Paper
              {...getRootProps()}
              sx={{
                p: 3,
                border: '2px dashed #ccc',
                borderColor: isDragActive ? 'primary.main' : '#ccc',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <input {...getInputProps()} />
              <Upload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography>
                {isDragActive ? 'Drop files here' : 'Drag & drop your pitch deck or click to select'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports PDF and PPTX files
              </Typography>
            </Paper>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.privacy_mode}
                  onChange={(e) => setFormData(prev => ({ ...prev, privacy_mode: e.target.checked }))}
                />
              }
              label="Privacy Mode (Data not retained after evaluation)"
            />

            {error && (
              <Alert severity="error">{error}</Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Startup Evaluation
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !formData.company_name || !formData.description}
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            >
              {loading ? 'Evaluating...' : 'Submit for Evaluation'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && (!formData.company_name || !formData.description))
              }
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default EvaluationForm;