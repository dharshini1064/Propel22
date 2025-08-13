import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SchoolIcon from '@mui/icons-material/School';
import PipelineIcon from '@mui/icons-material/Timeline';

function KpiStep({ data, onDataChange }) {
  const handleKpiChange = (field, value) => {
    onDataChange({
      kpis: {
        ...data.kpis,
        [field]: parseInt(value, 10) || 0,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 5: Set KPIs for First 3 Months
      </Typography>
      <Typography variant="body1" paragraph>
        Define the key performance indicators (KPIs) for the first 3 months of your partnership with {data.partner.name || 'your partner'}.
      </Typography>

      <Typography variant="body2" paragraph>
        These light KPIs will help track initial progress and engagement during the trial phase of the partnership.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <MeetingRoomIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <TextField
              label="New Meetings Setup"
              value={data.kpis.meetings}
              onChange={(e) => handleKpiChange('meetings', e.target.value)}
              type="number"
              fullWidth
              helperText="Target number of new meetings"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <TextField
              label="Trainings Completed"
              value={data.kpis.trainings}
              onChange={(e) => handleKpiChange('trainings', e.target.value)}
              type="number"
              fullWidth
              helperText="Target number of trainings"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <PipelineIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <TextField
              label="Pipeline Created"
              value={data.kpis.pipeline}
              onChange={(e) => handleKpiChange('pipeline', e.target.value)}
              type="number"
              fullWidth
              helperText="Target pipeline value ($)"
            />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        KPI Recommendations
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <MeetingRoomIcon />
          </ListItemIcon>
          <ListItemText
            primary="New Meetings Setup"
            secondary="Aim for at least 5-10 new customer meetings within the first 3 months to build momentum."
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText
            primary="Trainings Completed"
            secondary="Complete 2-3 product/service trainings to ensure the partner team is knowledgeable about your offerings."
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PipelineIcon />
          </ListItemIcon>
          <ListItemText
            primary="Pipeline Created"
            secondary="Target creating a pipeline of at least 2-3x your quarterly revenue goal to account for conversion rates."
          />
        </ListItem>
      </List>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Note: These KPIs should be realistic and achievable within the first 3 months. They will be used to evaluate the initial success of the partnership before committing to a longer-term agreement.
        </Typography>
      </Box>
    </Box>
  );
}

export default KpiStep;