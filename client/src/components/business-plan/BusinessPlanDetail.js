import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';

// Mock data for a business plan
const mockBusinessPlan = {
  id: '1',
  partnerName: 'Partner A',
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date('2023-02-10'),
  status: 'active',
  salesMetrics: {
    outboundACV: 6000,
    inboundACV: 5000,
    outboundSqlWinRate: 20,
    inboundSqlWinRate: 15,
    outboundTalSqlRate: 10,
    inboundTalSqlRate: 50,
    outboundCommissionRate: 20,
    inboundCommissionRate: 15,
  },
  targets: {
    netNewIACV: 120000,
    inboundLogos: 10,
    outboundLogos: 16,
    inboundSQLs: 68,
    outboundSQLs: 78,
    inboundTAL: 136,
    outboundTAL: 775,
    quarterlyBreakdown: {
      q1: { revenue: 30000, logos: 2, sqls: 16, tal: 32 },
      q2: { revenue: 60000, logos: 5, sqls: 32, tal: 64 },
      q3: { revenue: 6000, logos: 1, sqls: 4, tal: 8 },
      q4: { revenue: 24000, logos: 2, sqls: 16, tal: 32 },
    },
  },
  profitLoss: {
    partnerContribution: 2325,
    superOpsContribution: 13175,
    costs: {
      teamCTC: 0,
      travel: 0,
      marketing: 2325,
      toolsAndOffice: 0,
    },
    commissions: {
      inbound: 21450,
      outbound: 13800,
    },
    pbit: 19125,
  },
  contract: {
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    terms: 'This agreement outlines the partnership between our company and Partner A for joint business development activities.',
    exitClause: 'This agreement has a commitment for 3 months with flexibility to walk out any time after the initial period.',
  },
  kpis: {
    meetings: 5,
    trainings: 2,
    pipeline: 50000,
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`business-plan-tabpanel-${index}`}
      aria-labelledby={`business-plan-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `business-plan-tab-${index}`,
    'aria-controls': `business-plan-tabpanel-${index}`,
  };
}

function BusinessPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [businessPlan, setBusinessPlan] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setBusinessPlan(mockBusinessPlan);
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/business-plans');
  };

  const handleEdit = () => {
    navigate(`/business-plans/${id}/edit`);
  };

  const handleExportPdf = () => {
    // In a real app, this would generate and download a PDF
    console.log(`Exporting business plan ${id} as PDF`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (!businessPlan) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading business plan...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Joint Business Plan: {businessPlan.partnerName}
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="h2" sx={{ mr: 2 }}>
                {businessPlan.partnerName}
              </Typography>
              <Chip
                label={businessPlan.status.charAt(0).toUpperCase() + businessPlan.status.slice(1)}
                color={getStatusColor(businessPlan.status)}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Created: {format(businessPlan.createdAt, 'MMM d, yyyy')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: {format(businessPlan.updatedAt, 'MMM d, yyyy')}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleExportPdf}
            >
              Export PDF
            </Button>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="business plan tabs">
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Sales Metrics" {...a11yProps(1)} />
            <Tab label="Targets" {...a11yProps(2)} />
            <Tab label="P&L" {...a11yProps(3)} />
            <Tab label="Contract" {...a11yProps(4)} />
            <Tab label="KPIs" {...a11yProps(5)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Summary</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Total Revenue</TableCell>
                      <TableCell align="right">${businessPlan.targets.netNewIACV.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">PBIT</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.pbit.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Partner Contribution</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.partnerContribution.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Your Contribution</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.superOpsContribution.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Contract Period</TableCell>
                      <TableCell align="right">
                        {format(businessPlan.contract.startDate, 'MMM d, yyyy')} - {format(businessPlan.contract.endDate, 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Quarterly Breakdown</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Quarter</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Logos</TableCell>
                      <TableCell align="right">SQLs</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Q1</TableCell>
                      <TableCell align="right">${businessPlan.targets.quarterlyBreakdown.q1.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q1.logos}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q1.sqls}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Q2</TableCell>
                      <TableCell align="right">${businessPlan.targets.quarterlyBreakdown.q2.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q2.logos}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q2.sqls}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Q3</TableCell>
                      <TableCell align="right">${businessPlan.targets.quarterlyBreakdown.q3.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q3.logos}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q3.sqls}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Q4</TableCell>
                      <TableCell align="right">${businessPlan.targets.quarterlyBreakdown.q4.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q4.logos}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q4.sqls}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Outbound Metrics</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Average Deal Size (ACV)</TableCell>
                      <TableCell align="right">${businessPlan.salesMetrics.outboundACV.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">SQL to WIN Ratio</TableCell>
                      <TableCell align="right">{businessPlan.salesMetrics.outboundSqlWinRate}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">TAL to SQL Ratio</TableCell>
                      <TableCell align="right">{businessPlan.salesMetrics.outboundTalSqlRate}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Commission Rate</TableCell>
                      <TableCell align="right">{businessPlan.salesMetrics.outboundCommissionRate}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Inbound Metrics</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Average Deal Size (ACV)</TableCell>
                      <TableCell align="right">${businessPlan.salesMetrics.inboundACV.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">SQL to WIN Ratio</TableCell>
                      <TableCell align="right">{businessPlan.salesMetrics.inboundSqlWinRate}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">TAL to SQL Ratio</TableCell>
                      <TableCell align="right">{businessPlan.salesMetrics.inboundTalSqlRate}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Commission Rate</TableCell>
                      <TableCell align="right">{businessPlan.salesMetrics.inboundCommissionRate}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Annual Targets</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Net New I-ACV</TableCell>
                      <TableCell align="right">${businessPlan.targets.netNewIACV.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Inbound Logos</TableCell>
                      <TableCell align="right">{businessPlan.targets.inboundLogos}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Outbound Logos</TableCell>
                      <TableCell align="right">{businessPlan.targets.outboundLogos}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Inbound SQLs</TableCell>
                      <TableCell align="right">{businessPlan.targets.inboundSQLs}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Outbound SQLs</TableCell>
                      <TableCell align="right">{businessPlan.targets.outboundSQLs}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Inbound TAL</TableCell>
                      <TableCell align="right">{businessPlan.targets.inboundTAL}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Outbound TAL</TableCell>
                      <TableCell align="right">{businessPlan.targets.outboundTAL}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Quarterly Breakdown</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Quarter</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Logos</TableCell>
                      <TableCell align="right">SQLs</TableCell>
                      <TableCell align="right">TAL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Q1</TableCell>
                      <TableCell align="right">${businessPlan.targets.quarterlyBreakdown.q1.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q1.logos}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q1.sqls}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q1.tal}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Q2</TableCell>
                      <TableCell align="right">${businessPlan.targets.quarterlyBreakdown.q2.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q2.logos}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q2.sqls}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q2.tal}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Q3</TableCell>
                      <TableCell align="right">${businessPlan.targets.quarterlyBreakdown.q3.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q3.logos}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q3.sqls}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q3.tal}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Q4</TableCell>
                      <TableCell align="right">${businessPlan.targets.quarterlyBreakdown.q4.revenue.toLocaleString()}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q4.logos}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q4.sqls}</TableCell>
                      <TableCell align="right">{businessPlan.targets.quarterlyBreakdown.q4.tal}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Budget Contributions</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Partner Contribution</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.partnerContribution.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Your Contribution</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.superOpsContribution.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Total Budget</TableCell>
                      <TableCell align="right">${(businessPlan.profitLoss.partnerContribution + businessPlan.profitLoss.superOpsContribution).toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Costs</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Team CTC</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.costs.teamCTC.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Travel</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.costs.travel.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Marketing</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.costs.marketing.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Tools & Office</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.costs.toolsAndOffice.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Total Costs</TableCell>
                      <TableCell align="right">${(businessPlan.profitLoss.costs.teamCTC + businessPlan.profitLoss.costs.travel + businessPlan.profitLoss.costs.marketing + businessPlan.profitLoss.costs.toolsAndOffice).toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Commissions & Profit</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Inbound Commissions</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.commissions.inbound.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Outbound Commissions</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.commissions.outbound.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Total Commissions</TableCell>
                      <TableCell align="right">${(businessPlan.profitLoss.commissions.inbound + businessPlan.profitLoss.commissions.outbound).toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">PBIT</TableCell>
                      <TableCell align="right">${businessPlan.profitLoss.pbit.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Contract Details</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Start Date</TableCell>
                      <TableCell align="right">{format(businessPlan.contract.startDate, 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">End Date</TableCell>
                      <TableCell align="right">{format(businessPlan.contract.endDate, 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Terms and Conditions</Typography>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="body1">{businessPlan.contract.terms}</Typography>
            </Paper>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Exit Clause</Typography>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="body1">{businessPlan.contract.exitClause}</Typography>
            </Paper>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <Typography variant="body1" paragraph>
            These KPIs are set for the first 3 months of the partnership to evaluate initial success.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>New Meetings Setup</Typography>
                <Typography variant="h3" color="primary">{businessPlan.kpis.meetings}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Target number of new customer meetings within the first 3 months
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Trainings Completed</Typography>
                <Typography variant="h3" color="primary">{businessPlan.kpis.trainings}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Target number of product/service trainings to be completed
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Pipeline Created</Typography>
                <Typography variant="h3" color="primary">${businessPlan.kpis.pipeline.toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Target pipeline value to be created in the first 3 months
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default BusinessPlanDetail;