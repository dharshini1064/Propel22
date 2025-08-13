import React, { useEffect } from 'react';
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
  // Handle Net New I-ACV change and calculate derived values
  const handleNetNewIACVChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    
    // Calculate derived values based on the orange Net New ACV input
    const derivedValues = calculateDerivedValues(value, data.salesMetrics);
    
    onDataChange({
      targets: {
        ...data.targets,
        ...derivedValues,
        netNewIACV: value,
      },
    });
  };
  
  // Calculate all derived values based on the Net New I-ACV (orange input)
  const calculateDerivedValues = (netNewIACV, salesMetrics) => {
    // Extract metrics needed for calculations
    const { 
      outboundACV, inboundACV, 
      outboundSqlWinRate, inboundSqlWinRate,
      outboundTalSqlRate, inboundTalSqlRate 
    } = salesMetrics;
    
    // Calculate outbound/inbound revenue split (60/40 by default)
    const outboundRevenue = netNewIACV * 0.6;
    const inboundRevenue = netNewIACV * 0.4;
    
    // Calculate logos (deals) needed based on ACV
    const outboundLogos = Math.ceil(outboundRevenue / outboundACV);
    const inboundLogos = Math.ceil(inboundRevenue / inboundACV);
    
    // Calculate SQLs needed based on win rates
    const outboundSQLs = Math.ceil(outboundLogos / (outboundSqlWinRate / 100));
    const inboundSQLs = Math.ceil(inboundLogos / (inboundSqlWinRate / 100));
    
    // Calculate TAL needed based on SQL conversion rates
    const outboundTAL = Math.ceil(outboundSQLs / (outboundTalSqlRate / 100));
    const inboundTAL = Math.ceil(inboundSQLs / (inboundTalSqlRate / 100));
    
    // Calculate quarterly breakdown (default distribution: 25%, 30%, 25%, 20%)
    const quarterlyBreakdown = {
      q1: {
        revenue: Math.round(netNewIACV * 0.25),
        logos: Math.ceil((outboundLogos + inboundLogos) * 0.25),
        sqls: Math.ceil((outboundSQLs + inboundSQLs) * 0.25),
        tal: Math.ceil((outboundTAL + inboundTAL) * 0.25)
      },
      q2: {
        revenue: Math.round(netNewIACV * 0.30),
        logos: Math.ceil((outboundLogos + inboundLogos) * 0.30),
        sqls: Math.ceil((outboundSQLs + inboundSQLs) * 0.30),
        tal: Math.ceil((outboundTAL + inboundTAL) * 0.30)
      },
      q3: {
        revenue: Math.round(netNewIACV * 0.25),
        logos: Math.ceil((outboundLogos + inboundLogos) * 0.25),
        sqls: Math.ceil((outboundSQLs + inboundSQLs) * 0.25),
        tal: Math.ceil((outboundTAL + inboundTAL) * 0.25)
      },
      q4: {
        revenue: Math.round(netNewIACV * 0.20),
        logos: Math.ceil((outboundLogos + inboundLogos) * 0.20),
        sqls: Math.ceil((outboundSQLs + inboundSQLs) * 0.20),
        tal: Math.ceil((outboundTAL + inboundTAL) * 0.20)
      }
    };
    
    return {
      inboundLogos,
      outboundLogos,
      inboundSQLs,
      outboundSQLs,
      inboundTAL,
      outboundTAL,
      quarterlyBreakdown
    };
  };
  
  // Recalculate when component mounts or when salesMetrics change
  useEffect(() => {
    if (data.targets.netNewIACV) {
      const derivedValues = calculateDerivedValues(data.targets.netNewIACV, data.salesMetrics);
      onDataChange({
        targets: {
          ...data.targets,
          ...derivedValues
        }
      });
    }
  }, [data.salesMetrics]);

  // Quarterly changes are now read-only as they're calculated from the Net New I-ACV
  const handleQuarterlyChange = (quarter, field, value) => {
    // This function is kept for compatibility but won't be used
    // as quarterly values are now calculated automatically
    console.log(`Manual quarterly changes disabled - values are formula-based`);
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
              Net New I-ACV (Orange Input)
              <Tooltip title="The total annual contract value for new business - this is the primary input that drives all calculations" placement="top">
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
            sx: { bgcolor: '#FFF3E0' } // Light orange background to highlight this is the primary input
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" gutterBottom>
        Quarterly Breakdown (Formula-Calculated)
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          The values below are automatically calculated based on the Net New I-ACV input and sales metrics.
        </Typography>
      </Box>

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
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    readOnly: true,
                  }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q2.revenue}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    readOnly: true,
                  }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q3.revenue}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    readOnly: true,
                  }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q4.revenue}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    readOnly: true,
                  }}
                  disabled
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
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q2.logos}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q3.logos}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q4.logos}
                  InputProps={{ readOnly: true }}
                  disabled
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
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q2.sqls}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q3.sqls}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q4.sqls}
                  InputProps={{ readOnly: true }}
                  disabled
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
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q2.tal}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q3.tal}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  size="small"
                  type="number"
                  value={data.targets.quarterlyBreakdown.q4.tal}
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </TableCell>
              <TableCell align="right">{totals.tal}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Note: All values are automatically calculated based on the orange Net New I-ACV input and the sales metrics defined in Step 1. The quarterly breakdown follows a 25/30/25/20 distribution across Q1-Q4.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Formula calculations:
          <ul>
            <li>Outbound Revenue = Net New I-ACV × 60%</li>
            <li>Inbound Revenue = Net New I-ACV × 40%</li>
            <li>Logos = Revenue ÷ Average Deal Size (ACV)</li>
            <li>SQLs = Logos ÷ (SQL-to-Win Rate ÷ 100)</li>
            <li>TAL = SQLs ÷ (TAL-to-SQL Rate ÷ 100)</li>
          </ul>
        </Typography>
      </Box>
    </Box>
  );
}

export default TargetsStep;