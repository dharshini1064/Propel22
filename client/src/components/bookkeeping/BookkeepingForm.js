import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
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
  date: Yup.date().required('Date is required'),
  description: Yup.string().required('Description is required'),
  amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
  type: Yup.string().required('Type is required'),
  category: Yup.string().required('Category is required')
});

const BookkeepingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [businessPlans, setBusinessPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    businessPlanId: '',
    date: new Date(),
    description: '',
    amount: '',
    type: 'expense', // Default to expense
    category: 'operations' // Default to operations
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
      const fetchBookkeepingEntry = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/bookkeeping/${id}`);
          const entry = response.data;
          setInitialValues({
            ...entry,
            date: new Date(entry.date)
          });
        } catch (error) {
          console.error('Error fetching bookkeeping entry:', error);
          setSnackbar({
            open: true,
            message: 'Failed to load bookkeeping entry',
            severity: 'error'
          });
        } finally {
          setLoading(false);
        }
      };

      fetchBookkeepingEntry();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await axios.put(`/api/bookkeeping/${id}`, values);
        setSnackbar({
          open: true,
          message: 'Bookkeeping entry updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post('/api/bookkeeping', values);
        setSnackbar({
          open: true,
          message: 'Bookkeeping entry created successfully',
          severity: 'success'
        });
      }
      setTimeout(() => navigate('/bookkeeping'), 2000);
    } catch (error) {
      console.error('Error saving bookkeeping entry:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditMode ? 'update' : 'create'} bookkeeping entry`,
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        {isEditMode ? 'Edit Bookkeeping Entry' : 'Create Bookkeeping Entry'}
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
                      label="Date"
                      value={values.date}
                      onChange={(newValue) => {
                        setFieldValue('date', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          margin="normal"
                          error={touched.date && Boolean(errors.date)}
                          helperText={touched.date && errors.date}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="description"
                    label="Description"
                    fullWidth
                    margin="normal"
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={touched.amount && Boolean(errors.amount)}
                    helperText={touched.amount && errors.amount}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="type-label">Type</InputLabel>
                    <Field
                      as={Select}
                      labelId="type-label"
                      name="type"
                      label="Type"
                      error={touched.type && Boolean(errors.type)}
                    >
                      <MenuItem value="income">Income</MenuItem>
                      <MenuItem value="expense">Expense</MenuItem>
                    </Field>
                    {touched.type && errors.type && (
                      <Typography color="error" variant="caption">
                        {errors.type}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Field
                      as={Select}
                      labelId="category-label"
                      name="category"
                      label="Category"
                      error={touched.category && Boolean(errors.category)}
                    >
                      <MenuItem value="operations">Operations</MenuItem>
                      <MenuItem value="marketing">Marketing</MenuItem>
                      <MenuItem value="sales">Sales</MenuItem>
                      <MenuItem value="development">Development</MenuItem>
                      <MenuItem value="administration">Administration</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Field>
                    {touched.category && errors.category && (
                      <Typography color="error" variant="caption">
                        {errors.category}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/bookkeeping')}
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

export default BookkeepingForm;