import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Grid,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Security,
  Delete,
  Download,
  Visibility,
  Lock,
  CheckCircle,
  Warning,
  Schedule
} from '@mui/icons-material';

const PrivacyCenter: React.FC = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataRetention: false,
    profileVisibility: true,
    matchingOptIn: true,
    analyticsOptIn: false,
    marketingEmails: false
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const handleDataExport = () => {
    // Implement data export
    setExportDialogOpen(true);
  };

  const handleAccountDeletion = () => {
    // Implement account deletion
    setDeleteDialogOpen(true);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Privacy & Data Control Center
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        AXIVAI is built with privacy-first principles. Control how your data is used and stored.
      </Typography>

      <Grid container spacing={3}>
        {/* Privacy Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Security color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Privacy Settings</Typography>
              </Box>

              <List>
                <ListItem>
                  <ListItemText 
                    primary="Data Retention"
                    secondary="Allow AXIVAI to store your evaluation data for dashboard access and analytics. When disabled, data is deleted after 24 hours."
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={privacySettings.dataRetention}
                        onChange={handleSettingChange('dataRetention')}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemText 
                    primary="Profile Visibility"
                    secondary="Allow your profile to be visible to potential matches in the investor/startup matching system."
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={privacySettings.profileVisibility}
                        onChange={handleSettingChange('profileVisibility')}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText 
                    primary="Matching Algorithm"
                    secondary="Participate in AI-powered matching between startups and investors. Your data helps improve match quality."
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={privacySettings.matchingOptIn}
                        onChange={handleSettingChange('matchingOptIn')}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText 
                    primary="Usage Analytics"
                    secondary="Allow anonymous usage data collection to help improve AXIVAI platform features and performance."
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={privacySettings.analyticsOptIn}
                        onChange={handleSettingChange('analyticsOptIn')}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider />

                <ListItem>
                  <ListItemText 
                    primary="Marketing Communications"
                    secondary="Receive emails about new features, industry insights, and platform updates."
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={privacySettings.marketingEmails}
                        onChange={handleSettingChange('marketingEmails')}
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Management */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Lock color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Data Management</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Download color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Export Your Data</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Download all your data including evaluations, settings, and activity history.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      onClick={handleDataExport}
                      startIcon={<Download />}
                    >
                      Request Data Export
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'error.main', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Delete color="error" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" color="error">Delete Account</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={handleAccountDeletion}
                      startIcon={<Delete />}
                    >
                      Delete Account
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Typography variant="h6">Compliance Status</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle2">GDPR</Typography>
                    <Chip label="Compliant" color="success" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle2">CCPA</Typography>
                    <Chip label="Compliant" color="success" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle2">DIFC DP Law</Typography>
                    <Chip label="Compliant" color="success" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Warning color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="subtitle2">EU AI Act</Typography>
                    <Chip label="Monitoring" color="warning" size="small" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Data Status */}
        <Grid item xs={12}>
          <Alert severity="info" icon={<Schedule />}>
            <Typography variant="subtitle2">Current Data Retention Status</Typography>
            <Typography variant="body2">
              Your evaluation data is currently {privacySettings.dataRetention ? 'being retained' : 'set for 24-hour deletion'}. 
              You have 3 stored evaluations that can be managed individually.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Data Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>Data Export Request</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Your data export will be prepared and sent to your registered email address within 24 hours.
            The export will include:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="All evaluation results and reports" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Account settings and preferences" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Activity history and usage data" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText primary="Matching and interaction history" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setExportDialogOpen(false)}>
            Confirm Export Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Account Deletion Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action is permanent and cannot be undone.
          </Alert>
          <Typography paragraph>
            Deleting your account will permanently remove:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText primary="All evaluation data and reports" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText primary="Your profile and preferences" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText primary="Matching history and connections" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Delete color="error" /></ListItemIcon>
              <ListItemText primary="All account data within 30 days" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(false)}>
            Confirm Deletion
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PrivacyCenter;