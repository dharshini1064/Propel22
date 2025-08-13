import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';

function SalesMetricsStep({ data, onDataChange }) {
  // Mock partner list - in a real app, this would come from an API
  const partners = [
    { id: '1', name: 'Partner A' },
    { id: '2', name: 'Partner B' },
    { id: '3', name: 'Partner C' },
  ];

  const handlePartnerChange = (event) => {
    const partnerId = event.target.value;
    const selectedPartner = partners.find((p) => p.id === partnerId);
    
    onDataChange({
      partner: {
        id: selectedPartner.id,
        name: selectedPartner.name,
      },
    });
  };

  const handleMetricsChange = (event) => {
    const { name, value } = event.target;
    onDataChange({
      salesMetrics: {
        ...data.salesMetrics,
        [name]: parseFloat(value),
      },
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 1: Define Sales Metrics
      </Typography>
      <Typography variant="body1" paragraph>
        Select a partner and define the sales metrics that will be used for the joint business plan.
      </Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="partner-select-label">Partner</InputLabel>
        <Select
          labelId="partner-select-label"
          id="partner-select"
          value={data.partner.id || ''}
          label="Partner"
          onChange={handlePartnerChange}
        >
          {partners.map((partner) => (
            <MenuItem key={partner.id} value={partner.id}>
              {partner.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Sales Metrics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" align="center">
            Outbound
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" align="center">
            Inbound
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="outboundACV"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Average Deal Size (ACV)
                <Tooltip title="The average contract value for outbound deals" placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            }
            value={data.salesMetrics.outboundACV}
            onChange={handleMetricsChange}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="inboundACV"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Average Deal Size (ACV)
                <Tooltip title="The average contract value for inbound deals" placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            }
            value={data.salesMetrics.inboundACV}
            onChange={handleMetricsChange}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="outboundSqlWinRate"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                SQL to WIN Ratio
                <Tooltip title="The percentage of SQLs that convert to won deals" placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            }
            value={data.salesMetrics.outboundSqlWinRate}
            onChange={handleMetricsChange}
            type="number"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="inboundSqlWinRate"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                SQL to WIN Ratio
                <Tooltip title="The percentage of SQLs that convert to won deals" placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            }
            value={data.salesMetrics.inboundSqlWinRate}
            onChange={handleMetricsChange}
            type="number"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="outboundTalSqlRate"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                TAL to SQL Ratio
                <Tooltip title="The percentage of target account list that converts to SQLs" placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            }
            value={data.salesMetrics.outboundTalSqlRate}
            onChange={handleMetricsChange}
            type="number"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="inboundTalSqlRate"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                TAL to SQL Ratio
                <Tooltip title="The percentage of target account list that converts to SQLs" placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            }
            value={data.salesMetrics.inboundTalSqlRate}
            onChange={handleMetricsChange}
            type="number"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="outboundCommissionRate"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Commission Rate
                <Tooltip title="The commission percentage for outbound deals" placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            }
            value={data.salesMetrics.outboundCommissionRate}
            onChange={handleMetricsChange}
            type="number"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="inboundCommissionRate"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Commission Rate
                <Tooltip title="The commission percentage for inbound deals" placement="top">
                  <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
            }
            value={data.salesMetrics.inboundCommissionRate}
            onChange={handleMetricsChange}
            type="number"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SalesMetricsStep;