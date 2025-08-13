import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Divider,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function ContractStep({ data, onDataChange }) {
  const handleDateChange = (field, value) => {
    onDataChange({
      contract: {
        ...data.contract,
        [field]: value,
      },
    });
  };

  const handleTextChange = (field, value) => {
    onDataChange({
      contract: {
        ...data.contract,
        [field]: value,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 4: Create Contract
      </Typography>
      <Typography variant="body1" paragraph>
        Define the contract terms for your joint business plan with {data.partner.name || 'your partner'}.
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Start Date"
              value={data.contract.startDate || null}
              onChange={(newValue) => handleDateChange('startDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="End Date"
              value={data.contract.endDate || null}
              onChange={(newValue) => handleDateChange('endDate', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Contract Terms
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <TextField
            label="Terms and Conditions"
            value={data.contract.terms}
            onChange={(e) => handleTextChange('terms', e.target.value)}
            multiline
            rows={6}
            fullWidth
            placeholder="Enter the terms and conditions of the contract..."
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" gutterBottom>
        Exit Clause
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <TextField
            label="Exit Clause"
            value={data.contract.exitClause}
            onChange={(e) => handleTextChange('exitClause', e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Define the exit clause with flexibility to walk out any time after the initial 3 months..."
            helperText="Recommended: Include a 3-month initial commitment with flexibility to exit afterward."
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Note: This contract template is a starting point. You may want to have your legal team review the final contract before signing.
        </Typography>
      </Box>
    </Box>
  );
}

export default ContractStep;