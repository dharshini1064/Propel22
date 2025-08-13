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
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';

function TargetsStep({ data, onDataChange }) {
  const handleNetNewIACVChange = (event) => {
    const value = parseFloat(event.target.value);
    onDataChange({
      targets: {
        ...data.targets,
        netNewIACV: value,
      },
    });
  };

  const handleQuarterlyChange = (quarter, field, value) => {
    onDataChange({
      targets: {
        ...data.targets,
        quarterlyBreakdown: {
          ...data.targets.quarterlyBreakdown,
          [quarter]: {
            ...data.targets.quarterlyBreakdown[quarter],
            [field]: parseFloat(value),
          },
        },
      },
    });
  };

  // Calculate totals
  const calculateTotals = () => {
    const { q1, q2, q3, q4 } = data.targets.quarterlyBreakdown;
    return {
      revenue: q1.revenue + q2.revenue + q3.revenue + q4.revenue,
      logos: q1.logos + q2.logos + q3.logos + q4.logos,
      sqls: q1.sqls + q2.sqls + q3.sqls + q4.sqls,
      tal: q1.tal + q2.tal + q3.tal + q4.tal,
    };
  };

  const totals = calculateTotals();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 2: Set Targets
      </Typography>
      <Typography variant="body1" paragraph>
        Define your annual targets and quarterly breakdown for the joint business plan with {data.partner.name || 'your partner'}.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              Net New I-ACV
              <Tooltip title="The total annual contract value for new business" placement="top">
                <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
              </Tooltip>
            </Box>
          }
          value={data.targets.netNewIACV}
          onChange={handleNetNewIACVChange}
          type="number"
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Quarterly Breakdown
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell align="right">Q1</TableCell>
              <TableCell align="right">Q2</TableCell>
              <TableCell align="right">Q3</TableCell>
              <TableCell align="right">Q4</TableCell>
              <TableCell align="right">FY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Revenue
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q1.revenue}
                  onChange={(e) => handleQuarterlyChange('q1', 'revenue', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q2.revenue}
                  onChange={(e) => handleQuarterlyChange('q2', 'revenue', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q3.revenue}
                  onChange={(e) => handleQuarterlyChange('q3', 'revenue', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q4.revenue}
                  onChange={(e) => handleQuarterlyChange('q4', 'revenue', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </TableCell>
              <TableCell align="right">${totals.revenue.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Logos to be added
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q1.logos}
                  onChange={(e) => handleQuarterlyChange('q1', 'logos', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q2.logos}
                  onChange={(e) => handleQuarterlyChange('q2', 'logos', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q3.logos}
                  onChange={(e) => handleQuarterlyChange('q3', 'logos', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q4.logos}
                  onChange={(e) => handleQuarterlyChange('q4', 'logos', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">{totals.logos}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                SQLs required
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q1.sqls}
                  onChange={(e) => handleQuarterlyChange('q1', 'sqls', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q2.sqls}
                  onChange={(e) => handleQuarterlyChange('q2', 'sqls', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q3.sqls}
                  onChange={(e) => handleQuarterlyChange('q3', 'sqls', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q4.sqls}
                  onChange={(e) => handleQuarterlyChange('q4', 'sqls', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">{totals.sqls}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                TAL required
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q1.tal}
                  onChange={(e) => handleQuarterlyChange('q1', 'tal', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q2.tal}
                  onChange={(e) => handleQuarterlyChange('q2', 'tal', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q3.tal}
                  onChange={(e) => handleQuarterlyChange('q3', 'tal', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q4.tal}
                  onChange={(e) => handleQuarterlyChange('q4', 'tal', e.target.value)}
                />
              </TableCell>
              <TableCell align="right">{totals.tal}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Note: The quarterly breakdown should align with your annual targets. The system will automatically calculate the required SQLs and TAL based on your conversion rates.
        </Typography>
      </Box>
    </Box>
  );
}

export default TargetsStep;