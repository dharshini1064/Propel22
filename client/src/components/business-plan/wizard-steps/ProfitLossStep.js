import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

function ProfitLossStep({ data, onDataChange }) {
  const handleCostChange = (costType, value) => {
    onDataChange({
      profitLoss: {
        ...data.profitLoss,
        costs: {
          ...data.profitLoss.costs,
          [costType]: parseFloat(value),
        },
      },
    });
  };

  const handleContributionChange = (field, value) => {
    onDataChange({
      profitLoss: {
        ...data.profitLoss,
        [field]: parseFloat(value),
      },
    });
  };

  // Calculate totals
  const calculateTotals = () => {
    const { teamCTC, travel, marketing, toolsAndOffice } = data.profitLoss.costs;
    const totalCosts = teamCTC + travel + marketing + toolsAndOffice;
    const totalCommissions = data.profitLoss.commissions.inbound + data.profitLoss.commissions.outbound;
    const totalRevenue = data.targets.quarterlyBreakdown.q1.revenue +
                        data.targets.quarterlyBreakdown.q2.revenue +
                        data.targets.quarterlyBreakdown.q3.revenue +
                        data.targets.quarterlyBreakdown.q4.revenue;
    
    // Calculate PBIT (Profit Before Interest and Taxes)
    const pbit = totalRevenue - (totalCosts + totalCommissions);
    
    return {
      totalCosts,
      totalCommissions,
      totalRevenue,
      pbit,
    };
  };

  const totals = calculateTotals();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 3: Review Profit & Loss
      </Typography>
      <Typography variant="body1" paragraph>
        Review and adjust the profit and loss statement for your joint business plan with {data.partner.name || 'your partner'}.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Partner's Contribution to Budget"
            value={data.profitLoss.partnerContribution}
            onChange={(e) => handleContributionChange('partnerContribution', e.target.value)}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Your Contribution"
            value={data.profitLoss.superOpsContribution}
            onChange={(e) => handleContributionChange('superOpsContribution', e.target.value)}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Costs
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Team CTC"
            value={data.profitLoss.costs.teamCTC}
            onChange={(e) => handleCostChange('teamCTC', e.target.value)}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Travel"
            value={data.profitLoss.costs.travel}
            onChange={(e) => handleCostChange('travel', e.target.value)}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Marketing (Events, MDF, Cofunding, Others)"
            value={data.profitLoss.costs.marketing}
            onChange={(e) => handleCostChange('marketing', e.target.value)}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Tools + Office Space"
            value={data.profitLoss.costs.toolsAndOffice}
            onChange={(e) => handleCostChange('toolsAndOffice', e.target.value)}
            type="number"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Profit & Loss Summary
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Total Revenue
              </TableCell>
              <TableCell align="right">${totals.totalRevenue.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Partner Commissions - Inbound
              </TableCell>
              <TableCell align="right">${data.profitLoss.commissions.inbound.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Partner Commissions - Outbound
              </TableCell>
              <TableCell align="right">${data.profitLoss.commissions.outbound.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Total Costs
              </TableCell>
              <TableCell align="right">${totals.totalCosts.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow sx={{ '& > *': { fontWeight: 'bold', backgroundColor: '#f5f5f5' } }}>
              <TableCell component="th" scope="row">
                Profit/Loss Before Interest and Taxes
              </TableCell>
              <TableCell align="right" sx={{ color: totals.pbit >= 0 ? 'green' : 'red' }}>
                ${totals.pbit.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Note: The profit and loss statement is automatically calculated based on your targets and costs. Adjust the values as needed to achieve your desired profitability.
        </Typography>
      </Box>
    </Box>
  );
}

export default ProfitLossStep;