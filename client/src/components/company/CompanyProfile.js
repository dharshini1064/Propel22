import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  InputAdornment,
  Snackbar,
  Alert,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Validation schema
const CompanyProfileSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  industry: Yup.string().required('Industry is required'),
  region: Yup.string().required('Region is required'),
  teamSize: Yup.number().positive('Must be positive').required('Team size is required'),
  outboundACV: Yup.number().positive('Must be positive').required('Outbound ACV is required'),
  inboundACV: Yup.number().positive('Must be positive').required('Inbound ACV is required'),
  outboundSqlWinRate: Yup.number().min(0, 'Min 0%').max(100, 'Max 100%').required('Required'),
  inboundSqlWinRate: Yup.number().min(0, 'Min 0%').max(100, 'Max 100%').required('Required'),
  outboundTalSqlRate: Yup.number().min(0, 'Min 0%').max(100, 'Max 100%').required('Required'),
  inboundTalSqlRate: Yup.number().min(0, 'Min 0%').max(100, 'Max 100%').required('Required'),
  outboundCommissionRate: Yup.number().min(0, 'Min 0%').max(100, 'Max 100%').required('Required'),
  inboundCommissionRate: Yup.number().min(0, 'Min 0%').max(100, 'Max 100%').required('Required'),
  marketingBudget: Yup.number().min(0, 'Must be positive or zero').required('Required'),
});

function CompanyProfile() {
  const [success, setSuccess] = useState(false);

  // Mock initial values - in a real app, these would come from an API
  const initialValues = {
    companyName: 'Your Company',
    industry: 'Software',
    region: 'North America',
    teamSize: 50,
    outboundACV: 6000,
    inboundACV: 5000,
    outboundSqlWinRate: 20,
    inboundSqlWinRate: 15,
    outboundTalSqlRate: 10,
    inboundTalSqlRate: 50,
    outboundCommissionRate: 20,
    inboundCommissionRate: 15,
    marketingBudget: 15500,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // In a real app, this would make an API call to save the profile
    setTimeout(() => {
      console.log('Company profile saved:', values);
      setSuccess(true);
      setSubmitting(false);
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Company Profile
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={CompanyProfileSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="companyName"
                    label="Company Name"
                    fullWidth
                    error={touched.companyName && Boolean(errors.companyName)}
                    helperText={touched.companyName && errors.companyName}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="industry"
                    label="Industry"
                    fullWidth
                    error={touched.industry && Boolean(errors.industry)}
                    helperText={touched.industry && errors.industry}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="region"
                    label="Region"
                    fullWidth
                    error={touched.region && Boolean(errors.region)}
                    helperText={touched.region && errors.region}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="teamSize"
                    label="Team Size"
                    type="number"
                    fullWidth
                    error={touched.teamSize && Boolean(errors.teamSize)}
                    helperText={touched.teamSize && errors.teamSize}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Sales Metrics
              </Typography>
              <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" align="center">
                    Outbound
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" align="center">
                    Inbound
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="outboundACV"
                    label="Average Deal Size (ACV)"
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    error={touched.outboundACV && Boolean(errors.outboundACV)}
                    helperText={touched.outboundACV && errors.outboundACV}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="inboundACV"
                    label="Average Deal Size (ACV)"
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    error={touched.inboundACV && Boolean(errors.inboundACV)}
                    helperText={touched.inboundACV && errors.inboundACV}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="outboundSqlWinRate"
                    label="SQL to WIN Ratio"
                    type="number"
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={touched.outboundSqlWinRate && Boolean(errors.outboundSqlWinRate)}
                    helperText={touched.outboundSqlWinRate && errors.outboundSqlWinRate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="inboundSqlWinRate"
                    label="SQL to WIN Ratio"
                    type="number"
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={touched.inboundSqlWinRate && Boolean(errors.inboundSqlWinRate)}
                    helperText={touched.inboundSqlWinRate && errors.inboundSqlWinRate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="outboundTalSqlRate"
                    label="TAL to SQL Ratio"
                    type="number"
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={touched.outboundTalSqlRate && Boolean(errors.outboundTalSqlRate)}
                    helperText={touched.outboundTalSqlRate && errors.outboundTalSqlRate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="inboundTalSqlRate"
                    label="TAL to SQL Ratio"
                    type="number"
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={touched.inboundTalSqlRate && Boolean(errors.inboundTalSqlRate)}
                    helperText={touched.inboundTalSqlRate && errors.inboundTalSqlRate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="outboundCommissionRate"
                    label="Commission Rate"
                    type="number"
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={touched.outboundCommissionRate && Boolean(errors.outboundCommissionRate)}
                    helperText={touched.outboundCommissionRate && errors.outboundCommissionRate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="inboundCommissionRate"
                    label="Commission Rate"
                    type="number"
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={touched.inboundCommissionRate && Boolean(errors.inboundCommissionRate)}
                    helperText={touched.inboundCommissionRate && errors.inboundCommissionRate}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Budget
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="marketingBudget"
                    label="Marketing Budget"
                    type="number"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    error={touched.marketingBudget && Boolean(errors.marketingBudget)}
                    helperText={touched.marketingBudget && errors.marketingBudget}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>

      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Company profile saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CompanyProfile;