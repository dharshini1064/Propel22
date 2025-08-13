import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';

const validationSchema = Yup.object({
  name: Yup.string().required('Partner name is required'),
  website: Yup.string().url('Invalid URL format'),
  industry: Yup.string(),
  size: Yup.string(),
  address: Yup.string(),
  phone: Yup.string().required('Phone number is required'),
});

const PartnerList = () => {
  const [partners, setPartners] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Partner Name', width: 200 },
    { field: 'website', headerName: 'Website', width: 200 },
    { field: 'industry', headerName: 'Industry', width: 150 },
    { field: 'size', headerName: 'Size', width: 120 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'createdAt', headerName: 'Created At', width: 200, 
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() 
    },
  ];

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/partners');
      setPartners(response.data);
    } catch (error) {
      console.error('Error fetching partners:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load partners',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('/api/partners', values);
      setSnackbar({
        open: true,
        message: 'Partner added successfully',
        severity: 'success'
      });
      handleCloseDialog();
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error('Error adding partner:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add partner',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Partner Companies
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Partner
        </Button>
      </Box>

      <Paper sx={{ height: 'calc(100% - 60px)', width: '100%' }}>
        <DataGrid
          rows={partners}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          loading={loading}
        />
      </Paper>

      {/* Add Partner Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Partner</DialogTitle>
        <Formik
          initialValues={{
            name: '',
            website: '',
            industry: '',
            size: '',
            address: '',
            phone: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="name"
                  label="Partner Name"
                  fullWidth
                  margin="normal"
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  name="website"
                  label="Website"
                  fullWidth
                  margin="normal"
                  error={touched.website && Boolean(errors.website)}
                  helperText={touched.website && errors.website}
                />
                <Field
                  as={TextField}
                  name="industry"
                  label="Industry"
                  fullWidth
                  margin="normal"
                  error={touched.industry && Boolean(errors.industry)}
                  helperText={touched.industry && errors.industry}
                />
                <Field
                  as={TextField}
                  name="size"
                  label="Size (small, medium, large, enterprise)"
                  fullWidth
                  margin="normal"
                  error={touched.size && Boolean(errors.size)}
                  helperText={touched.size && errors.size}
                />
                <Field
                  as={TextField}
                  name="address"
                  label="Address"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
                <Field
                  as={TextField}
                  name="phone"
                  label="Phone"
                  fullWidth
                  margin="normal"
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  Add Partner
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default PartnerList;