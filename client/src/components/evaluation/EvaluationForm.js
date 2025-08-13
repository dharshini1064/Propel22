import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object({
  businessPlanId: Yup.string().required('Business plan is required'),
  evaluationDate: Yup.date().required('Evaluation date is required'),
  evaluator: Yup.string().required('Evaluator name is required'),
  marketScore: Yup.number().required('Market score is required').min(1).max(10),
  financialScore: Yup.number().required('Financial score is required').min(1).max(10),
  operationalScore: Yup.number().required('Operational score is required').min(1).max(10),
  riskScore: Yup.number().required('Risk score is required').min(1).max(10),
  comments: Yup.string()
});

const EvaluationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [businessPlans, setBusinessPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    businessPlanId: '',
    evaluationDate: new Date(),
    evaluator: '',
    marketScore: 5,
    financialScore: 5,
    operationalScore: 5,
    riskScore: 5,
    comments: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchBusinessPlans = async () => {
      try {
        const response = await axios.get('/api/business-plans');
        setBusinessPlans(response.data);
      } catch (error) {
        console.error('Error fetching business plans:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load business plans',
          severity: 'error'
        });
      }
    };

    fetchBusinessPlans();

    if (isEditMode) {
      const fetchEvaluation = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/evaluations/${id}`);
          const evaluation = response.data;
          setInitialValues({
            ...evaluation,
            evaluationDate: new Date(evaluation.evaluationDate)
          });
        } catch (error) {
          console.error('Error fetching evaluation:', error);
          setSnackbar({
            open: true,
            message: 'Failed to load evaluation',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      };

      fetchEvaluation();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await axios.put(`/api/evaluations/${id}`, values);
        setSnackbar({
          open: true,
          message: 'Evaluation updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post('/api/evaluations', values);
        setSnackbar({
          open: true,
          message: 'Evaluation created successfully',
          severity: 'success'
        });
      }
      setTimeout(() => navigate('/evaluations'), 2000);
    } catch (error) {
      console.error('Error saving evaluation:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditMode ? 'update' : 'create'} evaluation`,
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const calculateTotalScore = (values) => {
    const { marketScore, financialScore, operationalScore, riskScore } = values;
    return ((parseFloat(marketScore) + parseFloat(financialScore) + 
            parseFloat(operationalScore) + parseFloat(riskScore)) / 4).toFixed(2);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? 'Edit Evaluation' : 'Create Evaluation'}
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue, isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="business-plan-label">Business Plan</InputLabel>
                    <Field
                      as={Select}
                      labelId="business-plan-label"
                      name="businessPlanId"
                      label="Business Plan"
                      error={touched.businessPlanId && Boolean(errors.businessPlanId)}
                    >
                      {businessPlans.map((plan) => (
                        <MenuItem key={plan.id} value={plan.id}>
                          {plan.title}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.businessPlanId && errors.businessPlanId && (
                      <Typography color="error" variant="caption">
                        {errors.businessPlanId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Evaluation Date"
                      value={values.evaluationDate}
                      onChange={(newValue) => {
                        setFieldValue('evaluationDate', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          margin="normal"
                          error={touched.evaluationDate && Boolean(errors.evaluationDate)}
                          helperText={touched.evaluationDate && errors.evaluationDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="evaluator"
                    label="Evaluator Name"
                    fullWidth
                    margin="normal"
                    error={touched.evaluator && Boolean(errors.evaluator)}
                    helperText={touched.evaluator && errors.evaluator}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Evaluation Scores
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography id="market-score-label" gutterBottom>
                    Market Potential Score: {values.marketScore}
                  </Typography>
                  <Slider
                    aria-labelledby="market-score-label"
                    value={values.marketScore}
                    onChange={(_, newValue) => setFieldValue('marketScore', newValue)}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography id="financial-score-label" gutterBottom>
                    Financial Viability Score: {values.financialScore}
                  </Typography>
                  <Slider
                    aria-labelledby="financial-score-label"
                    value={values.financialScore}
                    onChange={(_, newValue) => setFieldValue('financialScore', newValue)}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography id="operational-score-label" gutterBottom>
                    Operational Feasibility Score: {values.operationalScore}
                  </Typography>
                  <Slider
                    aria-labelledby="operational-score-label"
                    value={values.operationalScore}
                    onChange={(_, newValue) => setFieldValue('operationalScore', newValue)}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography id="risk-score-label" gutterBottom>
                    Risk Assessment Score: {values.riskScore}
                  </Typography>
                  <Slider
                    aria-labelledby="risk-score-label"
                    value={values.riskScore}
                    onChange={(_, newValue) => setFieldValue('riskScore', newValue)}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 2, 
                      mt: 2, 
                      mb: 2, 
                      bgcolor: 'primary.light', 
                      color: 'primary.contrastText',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h6">
                      Overall Score: {calculateTotalScore(values)}/10
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="comments"
                    label="Comments and Recommendations"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    error={touched.comments && Boolean(errors.comments)}
                    helperText={touched.comments && errors.comments}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/evaluations')}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Create'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EvaluationForm;