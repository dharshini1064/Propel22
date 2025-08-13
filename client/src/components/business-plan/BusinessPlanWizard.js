import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
} from '@mui/material';

// Step components
import SalesMetricsStep from './wizard-steps/SalesMetricsStep';
import TargetsStep from './wizard-steps/TargetsStep';
import ProfitLossStep from './wizard-steps/ProfitLossStep';
import ContractStep from './wizard-steps/ContractStep';
import KpiStep from './wizard-steps/KpiStep';

const steps = [
  'Define Sales Metrics',
  'Set Targets',
  'Review P&L',
  'Create Contract',
  'Set KPIs',
];

function BusinessPlanWizard() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [planData, setPlanData] = useState({
    // Initial data structure for the business plan
    partner: {
      name: '',
      id: '',
    },
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
      startDate: '',
      endDate: '',
      terms: '',
      exitClause: '',
    },
    kpis: {
      meetings: 0,
      trainings: 0,
      pipeline: 0,
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepDataChange = (stepData) => {
    setPlanData((prevData) => ({
      ...prevData,
      ...stepData,
    }));
  };

  const handleFinish = () => {
    // In a real app, this would save the plan to the backend
    console.log('Business plan created:', planData);
    // Navigate to the business plans list
    navigate('/business-plans');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <SalesMetricsStep data={planData} onDataChange={handleStepDataChange} />;
      case 1:
        return <TargetsStep data={planData} onDataChange={handleStepDataChange} />;
      case 2:
        return <ProfitLossStep data={planData} onDataChange={handleStepDataChange} />;
      case 3:
        return <ContractStep data={planData} onDataChange={handleStepDataChange} />;
      case 4:
        return <KpiStep data={planData} onDataChange={handleStepDataChange} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Joint Business Plan
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 4 }}>
        {activeStep === steps.length ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              All steps completed - Business plan is ready!
            </Typography>
            <Button onClick={handleFinish} variant="contained" sx={{ mt: 2 }}>
              Finish
            </Button>
          </Box>
        ) : (
          <Box className="wizard-step">
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default BusinessPlanWizard;